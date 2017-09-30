import auth from '@/services/api/auth'
import router from '@/router'

export const types = {

  SET_REDIRECT_TO: 'Set RedirectTo',
  CLEAR_REDIRECT_TO: 'Clear RedirectTo',

  SET_JOIN_GROUP_AFTER_LOGIN: 'Join Group After Login',
  CLEAR_JOIN_GROUP_AFTER_LOGIN: 'Clear Join Group After Login',

  SET_ACCEPT_INVITE_AFTER_LOGIN: 'Accept Invite After Login',
  CLEAR_ACCEPT_INVITE_AFTER_LOGIN: 'Clear Accept Invite After Login',

  REQUEST_LOGIN_STATUS: 'Request Login Status',
  RECEIVE_LOGIN_STATUS: 'Receive Login Status',
  RECEIVE_LOGIN_STATUS_ERROR: 'Receive Login Status Error',

  REQUEST_LOGIN: 'Login Request',
  RECEIVE_LOGIN: 'Login Success',
  RECEIVE_LOGIN_ERROR: 'Login Error',

  REQUEST_LOGOUT: 'Logout Request',
  RECEIVE_LOGOUT: 'Logout Success',
  RECEIVE_LOGOUT_ERROR: 'Logout Failure',

  CLEAN_STATUS: 'Clean Status',
}

export const state = {
  user: null,
  status: {
    isWaiting: false,
    error: null,
  },
  redirectTo: null,
  joinGroupAfterLogin: null,
  acceptInviteAfterLogin: null,
}

export const getters = {
  isLoggedIn: state => !!state.user,
  user: state => state.user,
  userId: state => state.user && state.user.id,
  status: state => state.status,
  redirectTo: state => state.redirectTo,
}

export const actions = {

  setRedirectTo ({ commit }, redirectTo) {
    commit(types.SET_REDIRECT_TO, { redirectTo })
  },

  setJoinGroupAfterLogin ({ commit }, joinParams) {
    commit(types.SET_JOIN_GROUP_AFTER_LOGIN, { joinParams })
  },

  setAcceptInviteAfterLogin ({ commit }, token) {
    commit(types.SET_ACCEPT_INVITE_AFTER_LOGIN, { token })
  },

  async check ({ commit }) {
    commit(types.REQUEST_LOGIN_STATUS)
    try {
      commit(types.RECEIVE_LOGIN_STATUS, { user: await auth.status() })
    }
    catch (error) {
      commit(types.RECEIVE_LOGIN_STATUS_ERROR, { error })
    }
  },

  async login ({ state, commit, getters, dispatch }, data) {
    commit(types.REQUEST_LOGIN)
    let user = null
    try {
      user = await auth.login(data)
    }
    catch (error) {
      // if response error
      if (error.response) {
        let msg = null
        if (error.response.status < 500) {
          // handle form error
          msg = error.response.data
        }
        // ignore server error
        commit(types.RECEIVE_LOGIN_ERROR, { error: msg })
        return
      }
      // throw all other errors
      throw error
    }

    commit(types.RECEIVE_LOGIN, { user })

    if (state.acceptInviteAfterLogin) {
      dispatch('invitations/accept', state.acceptInviteAfterLogin)
    }
    else if (state.joinGroupAfterLogin) {
      const joinParams = state.joinGroupAfterLogin
      dispatch('groups/join', joinParams, { root: true })
    }
    else {
      router.push(getters.redirectTo || { name: 'groupsGallery' })
    }
    commit(types.CLEAR_ACCEPT_INVITE_AFTER_LOGIN)
    commit(types.CLEAR_JOIN_GROUP_AFTER_LOGIN)
    commit(types.CLEAR_REDIRECT_TO)
  },

  async logout ({ commit }) {
    commit(types.REQUEST_LOGOUT)
    try {
      commit(types.RECEIVE_LOGOUT, { user: await auth.logout() })
      router.push({ name: 'groupsGallery' })
    }
    catch (error) {
      commit(types.RECEIVE_LOGOUT_ERROR, { error })
    }
  },

  cleanStatus ({ commit }) {
    commit(types.CLEAN_STATUS)
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

  // Group to join after login
  [types.SET_JOIN_GROUP_AFTER_LOGIN] (state, { joinParams }) {
    state.joinGroupAfterLogin = joinParams
  },
  [types.CLEAR_JOIN_GROUP_AFTER_LOGIN] (state) {
    state.joinGroupAfterLogin = null
  },

  // Invite token to accept after login
  [types.SET_ACCEPT_INVITE_AFTER_LOGIN] (state, { token }) {
    state.acceptInviteAfterLogin = token
  },
  [types.CLEAR_ACCEPT_INVITE_AFTER_LOGIN] (state) {
    state.acceptInviteAfterLogin = null
  },

  // Check

  [types.REQUEST_LOGIN_STATUS] (state) {
    state.status = {
      isWaiting: false,
      error: null,
    }
  },
  [types.RECEIVE_LOGIN_STATUS] (state, { user }) {
    state.user = user
    state.status = {
      isWaiting: true,
      error: null,
    }
  },
  [types.RECEIVE_LOGIN_STATUS_ERROR] (state, { error }) {
    state.status = {
      isWaiting: false,
      error: error,
    }
  },

  // Login

  [types.REQUEST_LOGIN] (state) {
    state.status = {
      isWaiting: true,
      error: null,
    }
  },
  [types.RECEIVE_LOGIN] (state, { user }) {
    state.user = user
    state.status = {
      isWaiting: false,
      error: null,
    }
  },
  [types.RECEIVE_LOGIN_ERROR] (state, { error }) {
    state.status = {
      isWaiting: false,
      error: error,
    }
  },

  // Logout

  [types.REQUEST_LOGOUT] (state) {
    state.status = {
      isWaiting: true,
      error: null,
    }
  },
  [types.RECEIVE_LOGOUT] (state) {
    state.user = null
    state.status = {
      isWaiting: false,
      error: null,
    }
  },
  [types.RECEIVE_LOGOUT_ERROR] (state, { error }) {
    state.user = null
    state.status = {
      isWaiting: false,
      error: error,
    }
  },

  [types.CLEAN_STATUS] (state) {
    state.status = {
      isWaiting: false,
      error: null,
    }
  },
}
