import stores from '@/services/api/stores'
import { indexById } from '@/store/helpers'

export const types = {

  SELECT_STORE: 'Select Store',

  REQUEST_STORES: 'Request Stores',
  RECEIVE_STORES: 'Receive Stores',
  RECEIVE_STORES_ERROR: 'Receive Stores Error',

  CLEAR: 'Clear',
}

export const state = {
  entries: {},
  idList: [],
  isFetching: false,
  error: null,
  activeStoreId: null,
}

export const getters = {
  list: state => state.idList.map(i => state.entries[i]),
  get: state => (id) => state.entries[id],
  withLocation: (state, getters) => getters.list.filter(e => e.longitude && e.latitude),
  activeStore: state => state.entries[state.activeStoreId] || {},
  activeStoreId: state => state.activeStoreId,
}

export const actions = {
  async selectStore ({ commit, state, dispatch, getters, rootState }, storeId) {
    dispatch('pickups/setStoreFilter', storeId, {root: true})
    commit(types.SELECT_STORE, { storeId })
  },

  async fetchListByGroupId ({ commit }, groupId) {
    commit(types.REQUEST_STORES)
    try {
      commit(types.RECEIVE_STORES, { stores: await stores.listByGroupId(groupId) })
    }
    catch (error) {
      commit(types.RECEIVE_STORES_ERROR, { error })
    }
  },

  clear ({ commit }) {
    commit(types.CLEAR)
  },
}

export const mutations = {
  [types.SELECT_STORE] (state, { storeId }) {
    state.activeStoreId = storeId
  },
  [types.REQUEST_STORES] (state) {
    state.isFetching = true
  },
  [types.RECEIVE_STORES] (state, { stores }) {
    state.isFetching = false
    state.entries = indexById(stores)
    state.idList = stores.map(e => e.id)
  },
  [types.RECEIVE_STORES_ERROR] (state, { error }) {
    state.isFetching = false
    state.error = error
  },
  [types.CLEAR] (state) {
    state.activeStoreId = null
    state.entries = {}
    state.idList = []
  },
}
