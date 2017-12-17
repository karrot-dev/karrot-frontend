import Vue from 'vue'
import stores from '@/services/api/stores'
import { createMetaModule, withMeta, metaStatuses, metaStatusesWithId, indexById, createRouteError } from '@/store/helpers'
import router from '@/router'

function initialState () {
  return {
    entries: {},
    idList: [],
    activeStoreId: null,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    all: (state, getters) => state.idList.map(getters.get).sort(sortByName),
    byCurrentGroup: (state, getters, rootState, rootGetters) => getters.all.filter(e => e.group === rootGetters['currentGroup/id']),
    get: (state, getters) => id => getters.enrich(state.entries[id]),
    enrich: (state, getters) => store => {
      return store && {
        ...store,
        ...metaStatusesWithId(getters, ['save'], store.id),
      }
    },
    activeStore: (state, getters) => getters.get(state.activeStoreId) || {},
    activeStoreId: state => state.activeStoreId,
    ...metaStatuses(['create']),
  },
  actions: {
    ...withMeta({
      async save ({ commit, dispatch }, store) {
        commit('update', await stores.save(store))
        router.push({ name: 'store', params: { storeId: store.id } })
      },
      async create ({ commit, dispatch, rootGetters }, store) {
        const createdStore = await stores.create({
          ...store,
          group: rootGetters['currentGroup/id'],
        })
        commit('update', createdStore)
        router.push({ name: 'store', params: { storeId: createdStore.id } })
      },
      async fetch ({ commit }) {
        commit('set', await stores.list())
      },
    }),

    async selectStore ({ commit, state, dispatch, getters, rootState }, { storeId }) {
      if (!getters.get(storeId)) {
        try {
          const store = await stores.get(storeId)
          commit('update', store)
        }
        catch (error) {
          throw createRouteError()
        }
      }
      dispatch('pickups/setStoreFilter', storeId, {root: true})
      commit('select', storeId)
    },

    async clearSelectedStore ({ commit, dispatch }) {
      dispatch('pickups/clearStoreFilter', null, { root: true })
      commit('clearSelected')
    },

    clear ({ commit, dispatch }) {
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
  },
}

export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}
