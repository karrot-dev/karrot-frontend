import stores from '@/services/api/stores'
import { indexById } from '@/store/helpers'

export const types = {

  SELECT_STORE: 'Select Store',

  REQUEST_STORES: 'Request Stores',
  RECEIVE_STORES: 'Receive Stores',
  RECEIVE_STORES_ERROR: 'Receive Stores Error',
}

export const state = {
  entries: [],
  isFetching: false,
  error: null,
  activeStoreId: null,
}

export const getters = {
  list: state => state.entries,
  get: state => (id) => {
    return state.entries.find(e => e.id === id) || {}
  },
  withLocation: state => state.entries.filter(e => e.longitude && e.latitude),
  activeStore: state => state.activeStoreId && indexById(state.entries)[state.activeStoreId],
}

export const actions = {
  async selectStore ({ commit, state, dispatch, getters, rootState }, { storeId }) {
    console.log('selecting store!', storeId)
    commit(types.SELECT_STORE, { storeId })
    // dispatch('pickups/fetchListByStoreId', {storeId}, {root: true})
  },

  async fetchListByGroupId ({ commit }, { groupId }) {
    commit(types.REQUEST_STORES)
    try {
      commit(types.RECEIVE_STORES, { stores: await stores.listByGroupId(groupId) })
    }
    catch (error) {
      commit(types.RECEIVE_STORES_ERROR, { error })
    }
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
    state.entries = stores
  },
  [types.RECEIVE_STORES_ERROR] (state, { error }) {
    state.isFetching = false
    state.error = error
  },
}
