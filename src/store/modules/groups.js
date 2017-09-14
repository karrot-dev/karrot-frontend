import groups from '@/services/api/groups'

export const types = {
  REQUEST_GROUPS: 'Request Groups',
  RECEIVE_GROUPS: 'Receive Groups',
  RECEIVE_GROUPS_ERROR: 'Receive Groups Error'
}

export const state = {
  entries: [],
  isFetching: false,
  error: null
}

export const actions = {
  async fetchGroups ({ commit }) {
    commit(types.REQUEST_GROUPS)
    try {
      commit(types.RECEIVE_GROUPS, { groups: await groups.list() })
    }
    catch (error) {
      commit(types.RECEIVE_GROUPS_ERROR, { error })
    }
  }
}

export const mutations = {
  [types.REQUEST_GROUPS] (state) {
    state.isFetching = true
  },
  [types.RECEIVE_GROUPS] (state, { groups }) {
    state.isFetching = false
    state.entries = groups
  },
  [types.RECEIVE_GROUPS_ERROR] (state, { error }) {
    state.isFetching = false
    state.error = error.message
  }
}
