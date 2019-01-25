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
    all: (state, getters) => Object.values(state.entries).map(getters.enrich).sort(sortByName).sort(sortByStatus),
    notArchived: (state, getters) => getters.all.filter(s => s.status !== 'archived'),
    archived: (state, getters) => getters.all.filter(s => s.status === 'archived'),
    filtered: (state, getters) => getters.notArchived.filter(store => getters['toggle/showAll'] || store.status === 'active'),
    byCurrentGroup: (state, getters, rootState, rootGetters) => getters.filtered.filter(({ group }) => group && group.isCurrentGroup),
    byCurrentGroupArchived: (state, getters, rootState, rootGetters) => getters.archived.filter(({ group }) => group && group.isCurrentGroup),
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
    conversation: (state, getters, rootState, rootGetters) => {
      if (!state.activeStoreId) return
      return rootGetters['conversations/getForStore'](state.activeStoreId)
    },
  },
  actions: {
    ...withMeta({
      async save ({ dispatch }, store) {
        dispatch('update', [await stores.save(store)])
        router.push({ name: 'store', params: { storeId: store.id } })
      },
      async create ({ dispatch, rootGetters }, store) {
        const createdStore = await stores.create({
          ...store,
          group: rootGetters['currentGroup/id'],
        })
        dispatch('update', [createdStore])
        router.push({ name: 'store', params: { storeId: createdStore.id } })
      },
      async fetch ({ commit }) {
        commit('set', await stores.list())
      },

    }),
    ...withMeta({
      async selectStore ({ commit, dispatch, getters }, { storeId }) {
        if (getters.activeStoreId === storeId) return
        if (!getters.get(storeId)) {
          try {
            const store = await stores.get(storeId)
            commit('update', [store])
          }
          catch (error) {
            throw createRouteError()
          }
        }
        const getStatistics = stores.statistics(storeId)
        dispatch('sidenavBoxes/toggle/group', false, { root: true })
        commit('select', storeId)
        commit('setStatistics', { data: await getStatistics, id: storeId })
      },
    }, {
      findId: ({ storeId }) => storeId,
    }),

    clearSelectedStore ({ commit, dispatch, getters }, { routeTo }) {
      // do not clear if store stays the same
      const { storeId } = routeTo.params
      if (storeId && parseInt(storeId) === getters.activeStoreId) return

      dispatch('sidenavBoxes/toggle/group', true, { root: true })
      commit('clearSelected')
    },

    update ({ commit, dispatch, getters }, stores) {
      for (const store of stores) {
        const old = getters.get(store.id)
        // make sure we refresh pickups if store status changes
        // TODO move to vuex plugin in pickups module
        if (old && old.status !== store.status) {
          if (old.status === 'active' || store.status === 'active') {
            commit('pickups/clearUpcomingForStore', old.id, { root: true })
            dispatch('pickups/fetchListByGroupId', old.group.id, { root: true })
          }
        }
      }
      commit('update', stores)
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
    },
    clear (state) {
      Object.assign(state, initialState())
    },
    update (state, stores) {
      for (const store of stores) {
        Vue.set(state.entries, store.id, store)
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
