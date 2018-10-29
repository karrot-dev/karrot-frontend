import Vue from 'vue'
import stores from '@/stores/api/stores'
import { optionsFor } from '@/stores/storeStatus'
import {
  createMetaModule,
  withMeta,
  metaStatuses,
  metaStatusesWithId,
  indexById,
  createRouteError,
  toggles,
} from '@/utils/datastore/helpers'
import router from '@/base/router'

function initialState () {
  return {
    entries: {},
    statistics: {},
    idList: [],
    activeStoreId: null,
  }
}

export default {
  namespaced: true,
  modules: {
    meta: createMetaModule(),
    toggle: toggles({
      showAll: false,
    }),
  },
  state: initialState(),
  getters: {
    all: (state, getters) => state.idList.map(getters.get).sort(sortByName).sort(sortByStatus),
    notArchived: (state, getters) => getters.all.filter(s => s.status !== 'archived'),
    archived: (state, getters) => getters.all.filter(s => s.status === 'archived'),
    filtered: (state, getters) => getters.notArchived.filter(store => getters['toggle/showAll'] || store.status === 'active'),
    byCurrentGroup: (state, getters, rootState, rootGetters) => getters.filtered.filter(e => e.group.id === rootGetters['currentGroup/id']),
    byCurrentGroupArchived: (state, getters, rootState, rootGetters) => getters.archived.filter(e => e.group.id === rootGetters['currentGroup/id']),
    get: (state, getters) => id => getters.enrich(state.entries[id]),
    enrich: (state, getters, rootState, rootGetters) => store => {
      return store && {
        ...store,
        ...metaStatusesWithId(getters, ['save'], store.id),
        ui: optionsFor(store),
        group: rootGetters['groups/get'](store.group),
        statistics: state.statistics[store.id],
        isActiveStore: store.id === state.activeStoreId,
      }
    },
    activeStore: (state, getters) => getters.get(state.activeStoreId),
    activeStoreId: state => state.activeStoreId,
    ...metaStatuses(['create']),
  },
  actions: {
    ...withMeta({
      async save ({ dispatch }, store) {
        dispatch('update', await stores.save(store))
        router.push({ name: 'store', params: { storeId: store.id } })
      },
      async create ({ dispatch, rootGetters }, store) {
        const createdStore = await stores.create({
          ...store,
          group: rootGetters['currentGroup/id'],
        })
        dispatch('update', createdStore)
        router.push({ name: 'store', params: { storeId: createdStore.id } })
      },
      async fetch ({ commit }) {
        commit('set', await stores.list())
      },

    }),
    ...withMeta({
      async selectStore ({ commit, dispatch, getters }, { storeId }) {
        if (!getters.get(storeId)) {
          try {
            const store = await stores.get(storeId)
            commit('update', store)
          }
          catch (error) {
            throw createRouteError()
          }
        }
        const getStatistics = stores.statistics(storeId)
        dispatch('pickups/setStoreFilter', storeId, { root: true })
        dispatch('sidenavBoxes/toggle/group', false, { root: true })
        commit('select', storeId)
        commit('setStatistics', { data: await getStatistics, id: storeId })
      },
    }, {
      findId: ({ storeId }) => storeId,
    }),

    refresh ({ dispatch }) {
      dispatch('fetch')
    },

    clearSelectedStore ({ commit, dispatch }) {
      dispatch('pickups/clearStoreFilter', null, { root: true })
      dispatch('sidenavBoxes/toggle/group', true, { root: true })
      commit('clearSelected')
    },

    update ({ commit, dispatch, getters }, update) {
      const old = getters.get(update.id)
      if (old && old.status !== update.status) {
        if (old.status === 'active' || update.status === 'active') {
          dispatch('pickups/clearUpcomingForStore', old.id, { root: true })
          dispatch('pickups/setStoreFilter', getters.activeStoreId, { root: true })
          dispatch('pickups/fetchListByGroupId', old.group.id, { root: true })
        }
      }
      commit('update', update)
    },

    clear ({ commit }) {
      commit('clear')
    },

  },
  mutations: {
    select (state, storeId) {
      state.activeStoreId = storeId
    },
    clearSelected (state) {
      state.activeStoreId = null
    },
    set (state, stores) {
      state.entries = indexById(stores)
      state.idList = stores.map(e => e.id)
    },
    clear (state) {
      state.activeStoreId = null
      state.entries = {}
      state.idList = []
    },
    update (state, store) {
      Vue.set(state.entries, store.id, store)
      if (!state.idList.includes(store.id)) {
        state.idList.push(store.id)
      }
    },
    setStatistics (state, { id, data }) {
      Vue.set(state.statistics, id, data)
    },
  },
}

export function sortByStatus (a, b) {
  return a.ui.sort - b.ui.sort
}

export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}
