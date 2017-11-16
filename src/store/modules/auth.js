import auth from '@/services/api/auth'
import authUser from '@/services/api/authUser'
import router from '@/router'
import { types as userTypes } from '@/store/modules/users'
import { createMetaModule, withMeta, metaStatuses } from '@/store/helpers'

export const modules = { meta: createMetaModule() }

export const types = {
  SET_USER: 'Set user',
  CLEAR_USER: 'Clear user',

  SET_REDIRECT_TO: 'Set RedirectTo',
  CLEAR_REDIRECT_TO: 'Clear RedirectTo',

  SET_JOIN_GROUP_AFTER_LOGIN: 'Join Group After Login',
  CLEAR_JOIN_GROUP_AFTER_LOGIN: 'Clear Join Group After Login',

  SET_ACCEPT_INVITE_AFTER_LOGIN: 'Accept Invite After Login',
  CLEAR_ACCEPT_INVITE_AFTER_LOGIN: 'Clear Accept Invite After Login',
}

function initialState () {
  return {
    user: null,
    redirectTo: null,
    joinGroupAfterLogin: null,
    acceptInviteAfterLogin: null,
  }
}

export const state = initialState()

export const getters = {
  isLoggedIn: state => !!state.user,
  user: state => ({ ...state.user, __unenriched: state.user }),
  userId: state => state.user && state.user.id,
  status: state => state.status,
  redirectTo: state => state.redirectTo,
  ...metaStatuses(['login', 'update', 'changePassword', 'changeEmail']),
}

export const actions = {
  clearLoginStatus: ({ dispatch }) => dispatch('meta/clear', ['login']),

  ...withMeta({

    async check ({ commit, dispatch }) {
      try {
        commit(types.SET_USER, { user: await authUser.get() })
        dispatch('afterLoggedIn')
      }
      catch (error) {
        commit(types.CLEAR_USER)
        throw error
      }
    },

    async login ({ state, commit, getters, dispatch, rootGetters }, data) {
      const user = await auth.login(data)
      commit(types.SET_USER, { user })
      dispatch('afterLoggedIn')

      if (state.acceptInviteAfterLogin) {
        await dispatch('invitations/accept', state.acceptInviteAfterLogin, { root: true })
      }
      else if (state.joinGroupAfterLogin) {
        const joinParams = state.joinGroupAfterLogin
        const group = () => rootGetters['groups/get'](joinParams.id)
        if (group().isMember) {
          // go to group if already a member
          router.push({ name: 'group', params: { groupId: joinParams.id } })
        }
        else {
          await dispatch('groups/join', joinParams, { root: true })
          const hasError = Object.keys(group().joinStatus.validationErrors).length > 0
          if (hasError) {
            // go back to goup preview if error occured
            // it should show the error status on group preview, thanks to persistent state!
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

    async logout ({ commit }) {
      commit(types.CLEAR_USER, { user: await auth.logout() })
      router.push({ name: 'groupsGallery' })
    },

    async update ({ commit, state, dispatch }, data) {
      let user = state.user
      if (!user) return

      // TODO use objectDiff in component, remove from here
      let changed = Object.keys(data).some(key => user[key] !== data[key])

      if (!changed) {
        return
      }

      const savedUser = await authUser.save({ ...data })

      commit(types.SET_USER, { user: savedUser })
      commit(`users/${userTypes.RECEIVE_USER}`, { user: savedUser }, { root: true })
    },

    async changePassword ({ commit, state, dispatch }, { newPassword }) {
      await authUser.save({ password: newPassword })
      dispatch('logout')
    },

    async changeEmail ({ commit, dispatch }, email) {
      const savedUser = await authUser.save({ email })
      commit(types.SET_USER, { user: savedUser })
    },
  }),

  setRedirectTo ({ commit }, redirectTo) {
    commit(types.SET_REDIRECT_TO, { redirectTo })
  },

  setJoinGroupAfterLogin ({ commit }, joinParams) {
    commit(types.SET_JOIN_GROUP_AFTER_LOGIN, { joinParams })
  },

  setAcceptInviteAfterLogin ({ commit }, token) {
    commit(types.SET_ACCEPT_INVITE_AFTER_LOGIN, { token })
  },

  afterLoggedIn ({ state, dispatch }) {
    const { user } = state
    dispatch('i18n/setLocale', user.language || 'en', { root: true })
  },
}

export const mutations = {
  [types.SET_USER] (state, { user }) {
    state.user = user
  },
  [types.CLEAR_USER] (state) {
    state.user = null
  },

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
}
