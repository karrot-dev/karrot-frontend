import auth from '@/services/api/auth'

export const types = {

  REQUEST_STATUS: 'Request Status',
  RECEIVE_LOGIN_STATUS: 'Receive Status',

  REQUEST_LOGIN: 'Login Request',
  RECEIVE_LOGIN_SUCCESS: 'Login Success',
  RECEIVE_LOGIN_FAILURE: 'Login Error',

  REQUEST_LOGOUT: 'Logout Request',
  RECEIVE_LOGOUT_SUCCESS: 'Logout Success',
  RECEIVE_LOGOUT_FAILURE: 'Logout Failure'
}

export const state = {
  user: null,
  error: null
}

export const getters = {
  isLoggedIn: state => !!state.user
}

export const actions = {

  async check ({ commit }) {
    commit(types.REQUEST_STATUS)
    try {
      commit(types.RECEIVE_LOGIN_STATUS, {user: await auth.status()})
    }
    catch (error) {
      // ignore
    }
  },

  async login ({ commit }, data) {
    commit(types.REQUEST_LOGIN)
    try {
      commit(types.RECEIVE_LOGIN_SUCCESS, { user: await auth.login(data) })
    }
    catch (error) {
      commit(types.RECEIVE_LOGIN_FAILURE, { error })
    }
  },

  async logout ({ commit }) {
    commit(types.REQUEST_LOGOUT)
    try {
      commit(types.RECEIVE_LOGOUT_SUCCESS, { user: await auth.logout() })
    }
    catch (error) {
      commit(types.RECEIVE_LOGOUT_FAILURE, { error })
    }
  }
}

export const mutations = {

  // Check

  [types.RECEIVE_LOGIN_STATUS] (state, { user }) {
    state.user = user
    state.error = null
  },

  // Login

  [types.REQUEST_LOGIN] (state) {
    state.error = null
  },
  [types.RECEIVE_LOGIN_SUCCESS] (state, { user }) {
    state.user = user
    state.error = null
  },
  [types.RECEIVE_LOGIN_FAILURE] (state, { error }) {
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
  [types.RECEIVE_LOGOUT_FAILURE] (state, { error }) {
    // assume it
    state.error = error.message
    state.user = null
  }
}
