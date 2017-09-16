import auth from '@/services/api/auth'

export const types = {

  REQUEST_STATUS: 'Request Status',
  RECEIVE_LOGIN_STATUS: 'Receive Status',
  RECEIVE_LOGIN_STATUS_ERROR: 'Receive Status Error',

  REQUEST_LOGIN: 'Login Request',
  RECEIVE_LOGIN_SUCCESS: 'Login Success',
  RECEIVE_LOGIN_ERROR: 'Login Error',

  REQUEST_LOGOUT: 'Logout Request',
  RECEIVE_LOGOUT_SUCCESS: 'Logout Success',
  RECEIVE_LOGOUT_ERROR: 'Logout Failure'
}

export const state = {
  user: null,
  error: null
}

export const getters = {
  isLoggedIn: state => !!state.user,
  user: state => state.user,
  userId: state => state.user && state.user.id
}

export const actions = {

  async check ({ commit }) {
    commit(types.REQUEST_STATUS)
    try {
      commit(types.RECEIVE_LOGIN_STATUS, { user: await auth.status() })
    }
    catch (error) {
      commit(types.RECEIVE_LOGIN_STATUS_ERROR, { error })
    }
  },

  async login ({ commit }, data) {
    commit(types.REQUEST_LOGIN)
    try {
      commit(types.RECEIVE_LOGIN_SUCCESS, { user: await auth.login(data) })
    }
    catch (error) {
      commit(types.RECEIVE_LOGIN_ERROR, { error })
    }
  },

  async logout ({ commit }) {
    commit(types.REQUEST_LOGOUT)
    try {
      commit(types.RECEIVE_LOGOUT_SUCCESS, { user: await auth.logout() })
    }
    catch (error) {
      commit(types.RECEIVE_LOGOUT_ERROR, { error })
    }
  }
}

export const mutations = {

  // Check

  [types.REQUEST_STATUS] (state) {
  },
  [types.RECEIVE_LOGIN_STATUS] (state, { user }) {
    state.user = user
    state.error = null
  },
  [types.RECEIVE_LOGIN_STATUS_ERROR] (state, { error }) {
    state.error = error
  },

  // Login

  [types.REQUEST_LOGIN] (state) {
    state.error = null
  },
  [types.RECEIVE_LOGIN_SUCCESS] (state, { user }) {
    state.user = user
    state.error = null
  },
  [types.RECEIVE_LOGIN_ERROR] (state, { error }) {
    state.error = null
  },

  // Logout

  [types.REQUEST_LOGOUT] (state) {
    state.error = null
  },
  [types.RECEIVE_LOGOUT_SUCCESS] (state, { user }) {
    state.user = null
    state.error = null
  },
  [types.RECEIVE_LOGOUT_ERROR] (state, { error }) {
    state.error = error.message
    state.user = null
  }
}
