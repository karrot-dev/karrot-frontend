import users from '@/services/api/users'
import { indexById } from '@/store/helpers'

export const types = {

  SELECT_USER: 'Select User',

  REQUEST_USER_SIGNUP: 'Request User Signup',
  RECEIVE_USER_SIGNUP: 'Receive User Signup',
  RECEIVE_USER_SIGNUP_ERROR: 'Receiver User Signup Error',
  CLEAN_SIGNUP: 'Clean Signup',

  REQUEST_USERS: 'Request Users',
  RECEIVE_USERS: 'Receive Users',
  RECEIVE_USERS_ERROR: 'Receive Users Error',
}

export const state = {
  entries: [],
  isFetching: false,
  error: null,
  activeUserId: null,
  signup: {
    isWaiting: false,
    error: null,
  },
}

export const getters = {
  list: state => state.entries,
  get: state => (id) => {
    return state.entries.find(e => e.id === id) || {}
  },
  withLocation: state => state.entries.filter(e => e.longitude && e.latitude),
  activeUser: state => state.activeUserId && indexById(state.entries)[state.activeUserId],
  signupStatus: state => state.signup,
}

export const actions = {
  async selectUser ({ commit }, { userId }) {
    console.log('selecting user!', userId)
    commit(types.SELECT_USER, { userId })
  },

  async signup ({ commit, dispatch }, userData) {
    commit(types.REQUEST_USER_SIGNUP)
    try {
      await users.create(userData)
      commit(types.RECEIVE_USER_SIGNUP)
    }
    catch (error) {
      commit(types.RECEIVE_USER_SIGNUP_ERROR, { error })
      return
    }

    dispatch('auth/login', { email: userData.email, password: userData.password }, { root: true })
  },

  cleanSignup ({ commit }) {
    commit(types.CLEAN_SIGNUP)
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

  // sign user up
  [types.REQUEST_USER_SIGNUP] (state) {
    state.signup = {
      isWaiting: true,
      error: null,
    }
  },
  [types.RECEIVE_USER_SIGNUP] (state) {
    state.signup = {
      isWaiting: false,
      error: null,
    }
  },
  [types.RECEIVE_USER_SIGNUP_ERROR] (state, { error }) {
    state.signup = {
      isWaiting: false,
      error: error,
    }
  },
  [types.CLEAN_SIGNUP] (state) {
    state.signup = {
      isWaiting: false,
      error: null,
    }
  },

  // get users
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
