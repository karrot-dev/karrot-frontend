import users from '@/services/api/users'

// moved from helpers to avoid loading store
// TODO: put it somewhere general it will not pull in store!
export function indexById (iterable) {
  return iterable.reduce((acc, cur, i) => {
    acc[cur.id] = cur
    return acc
  }, {})
}

export const types = {

  SELECT_USER: 'Select User',

  REQUEST_USER_SIGNUP: 'Request User Signup',
  RECEIVE_USER_SIGNUP: 'Receive User Signup',
  RECEIVE_USER_SIGNUP_ERROR: 'Receiver User Signup Error',
  CLEAN_SIGNUP: 'Clean Signup',

  REQUEST_RESETPASSWORD: 'Request Reset Password',
  RECEIVE_RESETPASSWORD: 'Receive Reset Password',
  RECEIVE_RESETPASSWORD_ERROR: 'Receive Reset Password Error',
  CLEAN_PASSWORD_RESET: 'Clean Password Reset Status',

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
  resetpasswordStatus: {
    isWaiting: false,
    error: null,
    success: false,
  },
}

export const getters = {
  all: state => state.entries,
  get: state => (id) => {
    return state.entries.find(e => e.id === id) || {}
  },
  withLocation: state => state.entries.filter(e => e.longitude && e.latitude),
  activeUser: state => state.activeUserId && indexById(state.entries)[state.activeUserId],
  activeUserId: state => state.activeUserId,
  signupStatus: state => state.signup,
  passwordresetStatus: state => state.resetpasswordStatus,
}

export const actions = {
  async selectUser ({ commit }, userId) {
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

  async resetPassword ({ commit }, email) {
    commit(types.REQUEST_RESETPASSWORD)
    try {
      await users.resetPassword(email)
      commit(types.RECEIVE_RESETPASSWORD)
    }
    catch (error) {
      commit(types.RECEIVE_RESETPASSWORD_ERROR, { error })
    }
  },

  cleanPasswordreset ({ commit }) {
    commit(types.CLEAN_PASSWORD_RESET)
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

  // reset password
  [types.REQUEST_RESETPASSWORD] (state) {
    state.resetpasswordStatus = {
      isWaiting: true,
      error: null,
      success: false,
    }
  },
  [types.RECEIVE_RESETPASSWORD] (state) {
    state.resetpasswordStatus = {
      isWaiting: false,
      error: null,
      success: true,
    }
  },
  [types.RECEIVE_RESETPASSWORD_ERROR] (state, { error }) {
    state.resetpasswordStatus = {
      isWaiting: false,
      error,
      success: false,
    }
  },
  [types.CLEAN_PASSWORD_RESET] (state) {
    state.resetpasswordStatus = {
      isWaiting: false,
      error: null,
      success: false,
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
