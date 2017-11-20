import Vue from 'vue'
import users from '@/services/api/users'
import authUser from '@/services/api/authUser'
import auth from '@/services/api/auth'
import { indexById, onlyHandleAPIError } from '@/store/helpers'

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

  REQUEST_VERIFICATIONMAIL: 'Request Verification Mail',
  RECEIVE_VERIFICATIONMAIL: 'Recieve Verification Mail',
  RECEIVE_VERIFICATIONMAIL_ERROR: 'Recieve Verification Mail Error',

  REQUEST_USERS: 'Request Users',
  RECEIVE_USERS: 'Receive Users',
  RECEIVE_USERS_ERROR: 'Receive Users Error',

  RECEIVE_USER: 'Receive User',
}

function initialState () {
  return {
    entries: {},
    idList: [],
    isWaiting: false,
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
    resendVerificationStatus: {
      isWaiting: false,
      error: null,
      success: false,
    },
  }
}

export const state = initialState()

export const getters = {
  get: (state, getters, rootState, rootGetters) => userId => {
    return getters.enrich(state.entries[userId])
  },
  enrich: (state, getters, rootState, rootGetters) => user => {
    const authUserId = rootGetters['auth/userId']
    return user ? {
      ...user,
      isCurrentUser: user.id === authUserId,
      __unenriched: user,
    } : {
      isCurrentUser: false,
    }
  },
  all: (state, getters, rootState, rootGetters) => {
    return state.idList.map(getters.get)
  },
  byActiveGroup: (state, getters, rootState, rootGetters) => {
    const activeGroup = rootGetters['groups/activeGroup']
    return activeGroup.members ? activeGroup.members.map(getters.get) : []
  },
  activeUser: (state, getters, rootState, rootGetters) => {
    return state.activeUserId && getters.get(state.activeUserId)
  },
  activeUserId: state => state.activeUserId,
  signupStatus: state => state.signup,
  signupError: (state, getters) => field => getters.signupStatus.error && getters.signupStatus.error[field] && getters.signupStatus.error[field][0],
  passwordresetStatus: state => state.resetpasswordStatus,
  passwordresetError: (state, getters) => field => getters.passwordresetStatus.error && getters.passwordresetStatus.error[field] && getters.passwordresetStatus.error[field][0],
  resendVerificationStatus: state => state.resendVerificationStatus,
}

export const actions = {
  async selectUser ({ commit, getters, dispatch }, userId) {
    if (!getters.get(userId).id) {
      try {
        const user = await users.get(userId)
        commit(types.RECEIVE_USER, { user })
      }
      catch (error) {
        const message = { translation: 'PROFILE.INACCESSIBLE_OR_DELETED' }
        dispatch('routeError/set', message, { root: true })
        return
      }
    }
    commit(types.SELECT_USER, { userId })
  },

  async signup ({ commit, dispatch }, userData) {
    commit(types.REQUEST_USER_SIGNUP)
    try {
      await authUser.create(userData)
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_USER_SIGNUP_ERROR, data))
      return
    }
    commit(types.RECEIVE_USER_SIGNUP)
    dispatch('auth/login', { email: userData.email, password: userData.password }, { root: true })
  },

  cleanSignup ({ commit }) {
    commit(types.CLEAN_SIGNUP)
  },

  async resetPassword ({ commit }, email) {
    commit(types.REQUEST_RESETPASSWORD)
    try {
      await auth.resetPassword(email)
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_RESETPASSWORD_ERROR, data))
      return
    }
    commit(types.RECEIVE_RESETPASSWORD)
  },

  cleanPasswordreset ({ commit }) {
    commit(types.CLEAN_PASSWORD_RESET)
  },

  async resendVerificationmail ({ commit, state }) {
    if (state.resendVerificationStatus.isWaiting) return
    commit(types.REQUEST_VERIFICATIONMAIL)
    try {
      await authUser.resendVerificationRequest()
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_VERIFICATIONMAIL_ERROR, data))
      return
    }
    commit(types.RECEIVE_VERIFICATIONMAIL)
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

  // resend verification mail
  [types.REQUEST_VERIFICATIONMAIL] (state) {
    state.resendVerificationStatus = {
      isWaiting: true,
      error: null,
      success: false,
    }
  },
  [types.RECEIVE_VERIFICATIONMAIL] (state) {
    state.resendVerificationStatus = {
      isWaiting: false,
      error: null,
      success: true,
    }
  },
  [types.RECEIVE_VERIFICATIONMAIL_ERROR] (state, { error }) {
    state.resendVerificationStatus = {
      isWaiting: false,
      error,
      success: false,
    }
  },

  // get users
  [types.REQUEST_USERS] (state) {
    state.isWaiting = true
  },
  [types.RECEIVE_USERS] (state, { users }) {
    state.isWaiting = false
    state.entries = indexById(users)
    state.idList = users.map(e => e.id)
  },
  [types.RECEIVE_USERS_ERROR] (state, { error }) {
    state.isWaiting = false
    state.error = error
  },
  [types.RECEIVE_USER] (state, { user }) {
    Vue.set(state.entries, user.id, user)
    if (!state.idList.includes(user.id)) {
      state.idList.push(user.id)
    }
  },
}
