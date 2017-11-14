import auth from '@/services/api/auth'
import authUser from '@/services/api/authUser'
import router from '@/router'
import { onlyHandleAPIError } from '@/store/helpers'
import { types as userTypes } from '@/store/modules/users'

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

  RECEIVE_SAVE_ERROR: 'Receive Save Error',

  CLEAN_STATUS: 'Clean Status',
}

function initialState () {
  return {
    user: null,
    status: {
      isWaiting: false,
      error: null,
    },
    redirectTo: null,
    joinGroupAfterLogin: null,
    acceptInviteAfterLogin: null,
  }
}

export const state = initialState()

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

  async check ({ commit, dispatch }) {
    commit(types.REQUEST_LOGIN_STATUS)
    try {
      commit(types.RECEIVE_LOGIN_STATUS, { user: await authUser.get() })
      dispatch('afterLoggedIn')
    }
    catch (error) {
      commit(types.RECEIVE_LOGIN_STATUS_ERROR, { error })
    }
  },

  async login ({ state, commit, getters, dispatch, rootGetters }, data) {
    commit(types.REQUEST_LOGIN)
    let user = null
    try {
      user = await auth.login(data)
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_LOGIN_ERROR, data))
      return
    }

    commit(types.RECEIVE_LOGIN, { user })

    dispatch('afterLoggedIn')

    if (state.acceptInviteAfterLogin) {
      await dispatch('invitations/accept', state.acceptInviteAfterLogin, { root: true })
    }
    else if (state.joinGroupAfterLogin) {
      const joinParams = state.joinGroupAfterLogin
      if (rootGetters['groups/get'](joinParams.groupId).isMember) {
        // go to group if already a member
        router.push({ name: 'group', params: { groupId: joinParams.id } })
      }
      else {
        await dispatch('groups/join', joinParams, { root: true })
        if (rootGetters['groups/joinStatus'].error) {
          // go back to goup preview if error occured
          // it should show the error status on the page, thanks to persistent state!
          router.push({ name: 'groupInfo', params: { groupInfoId: joinParams.id } })
        }
      }
    }
    else if (getters.redirectTo) {
      router.push(getters.redirectTo)
    }
    else {
      router.push('/')
    }
    commit(types.CLEAR_ACCEPT_INVITE_AFTER_LOGIN)
    commit(types.CLEAR_JOIN_GROUP_AFTER_LOGIN)
    commit(types.CLEAR_REDIRECT_TO)
  },

  afterLoggedIn ({ state, dispatch }) {
    const { user } = state
    dispatch('i18n/setLocale', user.language || 'en', { root: true })
  },

  async logout ({ commit }) {
    commit(types.REQUEST_LOGOUT)
    try {
      commit(types.RECEIVE_LOGOUT, { user: await auth.logout() })
      router.push({ name: 'groupsGallery' })
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_LOGOUT_ERROR, data))
    }
  },

  async update ({ commit, state, dispatch }, data) {
    let user = state.user
    if (!user) return

    let changed = Object.keys(data).some(key => user[key] !== data[key])

    if (!changed) {
      return
    }

    let savedUser
    try {
      savedUser = await authUser.save({ ...data })
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_SAVE_ERROR, data))
      return
    }

    commit(types.RECEIVE_LOGIN_STATUS, { user: savedUser })
    commit(`users/${userTypes.RECEIVE_USER}`, { user: savedUser }, { root: true })
  },

  async changePassword ({ commit, state, dispatch }, { newPassword }) {
    let savedUser
    try {
      savedUser = await authUser.save({ password: newPassword })
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_SAVE_ERROR, data))
      return
    }
    commit(types.RECEIVE_LOGIN_STATUS, { user: savedUser })
    dispatch('logout')
  },

  async changeEmail ({ commit, dispatch }, email) {
    let savedUser
    try {
      savedUser = await authUser.save({ email })
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_SAVE_ERROR, data))
      return
    }
    commit(types.RECEIVE_LOGIN_STATUS, { user: savedUser })
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

  [types.RECEIVE_SAVE_ERROR] (state, { error }) {
    state.status.error = error
  },

  [types.CLEAN_STATUS] (state) {
    state.status = {
      isWaiting: false,
      error: null,
    }
  },
}
