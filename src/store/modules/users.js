import users from '@/services/api/users'
import { indexById } from '@/store/helpers'

export const types = {

  SELECT_USER: 'Select User',

  REQUEST_USERS: 'Request Users',
  RECEIVE_USERS: 'Receive Users',
  RECEIVE_USERS_ERROR: 'Receive Users Error',
}

export const state = {
  entries: [],
  isFetching: false,
  error: null,
  activeUserId: null,
}

export const getters = {
  list: state => state.entries,
  get: state => (id) => {
    return state.entries.find(e => e.id === id) || {}
  },
  withLocation: state => state.entries.filter(e => e.longitude && e.latitude),
  activeUser: state => state.activeUserId && indexById(state.entries)[state.activeUserId],
}

export const actions = {
  async selectUser ({ commit, state, dispatch, getters, rootState }, { userId }) {
    console.log('selecting user!', userId)
    commit(types.SELECT_USER, { userId })
  },

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
  [types.SELECT_USER] (state, { userId }) {
    state.activeUserId = userId
  },
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
