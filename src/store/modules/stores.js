import stores from '@/services/api/stores'

export const types = {

  REQUEST_STORES: 'Request Stores',
  RECEIVE_STORES: 'Receive Stores',
  RECEIVE_STORES_ERROR: 'Receive Stores Error'
}

export const state = {
  entries: [],
  isFetching: false,
  error: null
}

export const getters = {
  get: state => (id) => {
    return state.entries.find(e => e.id === id) || {}
  },
  withLocation: state => state.entries.filter(e => e.longitude && e.latitude)
}

export const actions = {
  async fetchListByGroupId ({ commit }, { groupId }) {
    commit(types.REQUEST_STORES)
    try {
      commit(types.RECEIVE_STORES, { stores: await stores.listByGroupId(groupId) })
    }
    catch (error) {
      commit(types.RECEIVE_STORES_ERROR, { error })
    }
  }
}

export const mutations = {
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
  }
}
