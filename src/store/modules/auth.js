import auth from '@/services/api/auth'
import router from '@/router'

export const types = {

  SET_REDIRECT_TO: 'Set RedirectTo',
  CLEAR_REDIRECT_TO: 'Clear RedirectTo',

  REQUEST_STATUS: 'Request Status',
  RECEIVE_LOGIN_STATUS: 'Receive Status',
  RECEIVE_LOGIN_STATUS_ERROR: 'Receive Status Error',

  REQUEST_LOGIN: 'Login Request',
  RECEIVE_LOGIN_SUCCESS: 'Login Success',
  RECEIVE_LOGIN_ERROR: 'Login Error',

  REQUEST_LOGOUT: 'Logout Request',
  RECEIVE_LOGOUT_SUCCESS: 'Logout Success',
  RECEIVE_LOGOUT_ERROR: 'Logout Failure',
}

export const state = {
  user: null,
  error: null,
  redirectTo: null,
}

export const getters = {
  isLoggedIn: state => !!state.user,
  user: state => state.user,
  userId: state => state.user && state.user.id,
  error: state => state.error,
  redirectTo: state => state.redirectTo,
}

export const actions = {

  setRedirectTo ({ commit }, redirectTo) {
    commit(types.SET_REDIRECT_TO, { redirectTo })
  },

  async check ({ commit }) {
    commit(types.REQUEST_STATUS)
    try {
      commit(types.RECEIVE_LOGIN_STATUS, { user: await auth.status() })
    }
    catch (error) {
      commit(types.RECEIVE_LOGIN_STATUS_ERROR, { error })
    }
  },

  async login ({ commit, state }, data) {
    commit(types.REQUEST_LOGIN)
    try {
      commit(types.RECEIVE_LOGIN_SUCCESS, { user: await auth.login(data) })
      router.push(state.redirectTo || { name: 'index' })
      commit(types.CLEAR_REDIRECT_TO)
    }
    catch (error) {
      commit(types.RECEIVE_LOGIN_ERROR, { error })
    }
  },

  async logout ({ commit }) {
    commit(types.REQUEST_LOGOUT)
    try {
      commit(types.RECEIVE_LOGOUT_SUCCESS, { user: await auth.logout() })
      router.push({ name: 'login' })
    }
    catch (error) {
      commit(types.RECEIVE_LOGOUT_ERROR, { error })
    }
  },
}

export const mutations = {

  // Redirect
  [types.SET_REDIRECT_TO] (state, { redirectTo }) {
    state.redirectTo = redirectTo
  },
  [types.CLEAR_REDIRECT_TO] (state) {
    state.redirectTo = null
  },

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
    state.error = error.response.data
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
  },
}
