import Vue from 'vue'
import stores from '@/services/api/stores'
import { createMetaModule, withMeta, metaStatuses, metaStatusesWithId, indexById, createRouteError } from '@/store/helpers'
import router from '@/router'

export const modules = { meta: createMetaModule() }

export const types = {

  SELECT_STORE: 'Select Store',
  CLEAR_SELECTED_STORE: 'Clear Selected Store',

  REQUEST_STORES: 'Request Stores',
  RECEIVE_STORES: 'Receive Stores',
  RECEIVE_STORES_ERROR: 'Receive Stores Error',

  RECEIVE_ITEM: 'Receive Item',

  CLEAR: 'Clear',
}

function initialState () {
  return {
    entries: {},
    idList: [],
    status: {
      isWaiting: false,
      error: null,
    },
    activeStoreId: null,
  }
}

export const state = initialState()

export const getters = {
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
  error: (state, getters) => field => getters.status.error && getters.status.error[field] && getters.status.error[field][0],
  ...metaStatuses(['create']),
}

export const actions = {
  ...withMeta({
    async save ({ commit, dispatch }, store) {
      commit(types.RECEIVE_ITEM, { store: await stores.save(store) })
      router.push({ name: 'store', params: { storeId: store.id } })
    },

    async create ({ commit, dispatch, rootGetters }, store) {
      const createdStore = await stores.create({
        ...store,
        group: rootGetters['currentGroup/id'],
      })
      commit(types.RECEIVE_ITEM, { store: createdStore })
      router.push({ name: 'store', params: { storeId: createdStore.id } })
    },

  }),

  async selectStore ({ commit, state, dispatch, getters, rootState }, { storeId }) {
    if (!getters.get(storeId)) {
      try {
        const store = await stores.get(storeId)
        commit(types.RECEIVE_ITEM, { store })
      }
      catch (error) {
        throw createRouteError()
      }
    }
    dispatch('pickups/setStoreFilter', storeId, {root: true})
    commit(types.SELECT_STORE, { storeId })
  },

  async clearSelectedStore ({ commit, dispatch }) {
    dispatch('pickups/clearStoreFilter', null, { root: true })
    commit(types.CLEAR_SELECTED_STORE)
  },

  async fetchList ({ commit }) {
    commit(types.REQUEST_STORES)
    try {
      commit(types.RECEIVE_STORES, { stores: await stores.list() })
    }
    catch (error) {
      commit(types.RECEIVE_STORES_ERROR, { error })
    }
  },

  clear ({ commit, dispatch }) {
    commit(types.CLEAR)
  },
}

export const mutations = {
  [types.SELECT_STORE] (state, { storeId }) {
    state.activeStoreId = storeId
  },
  [types.CLEAR_SELECTED_STORE] (state) {
    state.activeStoreId = null
  },
  [types.REQUEST_STORES] (state) {
    state.status.isWaiting = true
  },
  [types.RECEIVE_STORES] (state, { stores }) {
    state.status.isWaiting = false
    state.entries = indexById(stores)
    state.idList = stores.map(e => e.id)
  },
  [types.RECEIVE_STORES_ERROR] (state, { error }) {
    state.status.isWaiting = false
    state.status.error = error
  },
  [types.CLEAR] (state) {
    state.activeStoreId = null
    state.entries = {}
    state.idList = []
  },
  [types.RECEIVE_ITEM] (state, { store }) {
    Vue.set(state.entries, store.id, store)
    if (!state.idList.includes(store.id)) {
      state.idList.push(store.id)
    }
  },
}

export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}
