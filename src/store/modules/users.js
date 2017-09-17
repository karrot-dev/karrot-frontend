import users from '@/services/api/users'

export const types = {

  REQUEST_USERS: 'Request Users',
  RECEIVE_USERS: 'Receive Users',
  RECEIVE_USERS_ERROR: 'Receive Users Error',
}

export const state = {
  entries: [],
  isFetching: false,
  error: null,
}

export const getters = {
  list: state => state.entries,
  get: state => (id) => {
    return state.entries.find(e => e.id === id) || {}
  },
  withLocation: state => state.entries.filter(e => e.longitude && e.latitude),
}

export const actions = {
  async fetchList ({ commit }) {
    commit(types.REQUEST_USERS)
    try {
      commit(types.RECEIVE_USERS, { users: await users.list() })
    }
    catch (error) {
      commit(types.RECEIVE_USERS_ERROR, { error })
    }
  },
}

export const mutations = {
  [types.REQUEST_USERS] (state) {
    state.isFetching = true
  },
  [types.RECEIVE_USERS] (state, { users }) {
    state.isFetching = false
    state.entries = users
  },
  [types.RECEIVE_USERS_ERROR] (state, { error }) {
    state.isFetching = false
    state.error = error
  },
}
