import auth from '@/services/api/auth'

export const types = {

  REQUEST_LOGIN: '[AUTH] LOGIN REQUEST',
  RECEIVE_LOGIN_SUCCESS: '[AUTH] LOGIN SUCCESS',
  RECEIVE_LOGIN_FAILURE: '[AUTH] LOGIN FAILURE',

  REQUEST_LOGOUT: '[AUTH] LOGOUT REQUEST',
  RECEIVE_LOGOUT_SUCCESS: '[AUTH] LOGOUT SUCCESS',
  RECEIVE_LOGOUT_FAILURE: '[AUTH] LOGOUT FAILURE'
}

export const state = {
  user: null,
  error: null
}

export const getters = {
  isLoggedIn: state => !!state.user
}

export const actions = {
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
