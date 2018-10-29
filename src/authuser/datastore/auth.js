import auth from '@/authuser/api/auth'
import authUser from '@/authuser/api/authUser'
import router from '@/base/router'
import { createMetaModule, withMeta, metaStatuses } from '@/utils/datastore/helpers'
import { objectDiff } from '@/utils/utils'
import push from '@/subscriptions/datastore/auth/push'
import { throttle } from 'quasar'

function initialState () {
  return {
    user: null,
    redirectTo: null,
    joinGroupAfterLogin: null,
    acceptInviteAfterLogin: null,
    muteConversationAfterLogin: [],
    failedEmailDeliveries: [],
    maybeLoggedOut: false,
  }
}

const showLogoutToast = throttle((dispatch) => {
  dispatch('toasts/show', {
    message: 'USERDATA.LOGOUT_SUCCESS',
    config: {
      timeout: 5000,
    },
  }, { root: true })
}, 5000)

export default {
  namespaced: true,
  modules: { meta: createMetaModule(), push },
  state: initialState(),
  getters: {
    isLoggedIn: state => !!state.user,
    user: state => state.user,
    userId: state => state.user && state.user.id,
    currentGroupId: state => state.user && state.user.currentGroup,
    failedEmailDeliveries: state => state.failedEmailDeliveries,
    redirectTo: state => state.redirectTo,
    hasJoinGroupAfterLogin: state => Boolean(state.joinGroupAfterLogin),
    ...metaStatuses(['login', 'logout', 'save', 'changePassword', 'changeEmail']),
  },
  actions: {
    clearLoginStatus: ({ dispatch }) => dispatch('meta/clear', ['login']),
    ...withMeta({
      async login ({ state, commit, getters, dispatch, rootGetters }, data) {
        const user = await auth.login(data)
        dispatch('update', user)
        dispatch('afterLoggedIn')

        state.muteConversationAfterLogin.forEach(conversationId => {
          try {
            dispatch('conversations/maybeToggleEmailNotifications', {
              conversationId,
              value: false,
            }, { root: true })
          }
          catch (error) {}
          commit('clearMuteConversationAfterLogin')
        })

        if (state.acceptInviteAfterLogin) {
          await dispatch('invitations/accept', state.acceptInviteAfterLogin, { root: true })
        }
        else if (state.joinGroupAfterLogin) {
          const groupId = state.joinGroupAfterLogin
          const group = () => rootGetters['groups/get'](groupId)
          if (group().isMember) {
            // go to group if already a member
            router.push({ name: 'group', params: { groupId } })
          }
          else {
            await dispatch('groups/join', groupId, { root: true })
            if (group().joinStatus.hasValidationErrors) {
              // go back to goup preview if error occured
              // it should show the error status on group preview, thanks to persistent state!
              router.push({ name: 'groupPreview', params: { groupPreviewId: groupId } })
            }
          }
        }
        else if (getters.redirectTo) {
          router.push(getters.redirectTo)
        }
        else {
          router.push('/')
        }
        commit('clearAcceptInviteAfterLogin')
        commit('clearJoinGroupAfterLogin')
        commit('clearRedirectTo')
      },

      async logout ({ dispatch }) {
        await dispatch('push/disable')
        await dispatch('fcm/disable', null, { root: true })
        await auth.logout()

        dispatch('update', null)
        showLogoutToast(dispatch)

        dispatch('conversations/clear', null, { root: true }) // TODO move into plugin
        dispatch('currentThread/clear', null, { root: true }) // TODO move into plugin
        router.push({ name: 'groupsGallery' })
      },

      async changePassword ({ dispatch }, { oldPassword, newPassword, done }) {
        await auth.changePassword({ oldPassword, newPassword })
        done()
        dispatch('toasts/show', {
          message: 'PASSWORD.CHANGE.SUCCESS',
        }, { root: true })
      },

      async changeEmail ({ dispatch, getters }, { newEmail, password, done }) {
        await auth.changeEmail({ newEmail, password })
        done()
        dispatch('users/refresh', { userId: getters.userId }, { root: true })
        dispatch('refresh')
      },
    }),

    async getFailedEmailDeliveries ({ commit }) {
      commit('setFailedEmailDeliveries', await authUser.getFailedEmailDeliveries())
    },

    ...withMeta({
      async save ({ dispatch }, data) {
        await dispatch('backgroundSave', data)
        dispatch('toasts/show', {
          message: 'NOTIFICATIONS.CHANGES_SAVED',
          config: {
            timeout: 2000,
            icon: 'thumb_up',
          },
        }, { root: true })
      },
    }, {
      // ignore ID to have simple saveStatus
      findId: () => undefined,
    }),

    maybeBackgroundSave ({ dispatch, state }, data) {
      const diff = objectDiff(state.user, { ...state.user, ...data })
      if (Object.keys(diff).length === 0) return
      return dispatch('backgroundSave', diff)
    },

    async backgroundSave ({ commit, dispatch }, data) {
      const savedUser = await authUser.save(data)
      dispatch('update', savedUser)
      commit('users/update', [savedUser], { root: true })
      return savedUser
    },

    setRedirectTo ({ commit }, redirectTo) {
      commit('setRedirectTo', { redirectTo })
    },

    setJoinGroupAfterLogin ({ commit }, groupId) {
      commit('setJoinGroupAfterLogin', groupId)
    },

    setAcceptInviteAfterLogin ({ commit }, token) {
      commit('setAcceptInviteAfterLogin', { token })
    },

    setMuteConversationAfterLogin ({ commit }, conversationId) {
      commit('appendMuteConversationAfterLogin', { conversationId })
    },

    afterLoggedIn ({ state, dispatch }) {
      const { user } = state
      dispatch('i18n/setLocale', user.language || 'en', { root: true })
    },

    update ({ commit }, user) {
      commit('setUser', user)
    },

    async refresh ({ commit, dispatch, getters }) {
      const wasLoggedIn = getters.isLoggedIn
      let user = null
      try {
        user = await authUser.get()
      }
      catch (error) {}
      dispatch('update', user)
      commit('setMaybeLoggedOut', false)

      if (user) {
        dispatch('afterLoggedIn')
      }
      else if (wasLoggedIn && !getters.logoutStatus.pending) {
        dispatch('logout')
      }
    },

    clearSettingsStatus ({ commit, dispatch }) {
      dispatch('meta/clear', ['changeEmail'])
      dispatch('meta/clear', ['changePassword'])
      dispatch('meta/clear', ['save'])
      dispatch('users/clearResendVerificationCode', null, { root: true })
    },
  },
  mutations: {
    setUser (state, user) {
      state.user = user
    },

    // Redirect
    setRedirectTo (state, { redirectTo }) {
      state.redirectTo = redirectTo
    },
    clearRedirectTo (state) {
      state.redirectTo = null
    },

    // Group to join after login
    setJoinGroupAfterLogin (state, groupId) {
      state.joinGroupAfterLogin = groupId
    },
    clearJoinGroupAfterLogin (state) {
      state.joinGroupAfterLogin = null
    },

    // Invite token to accept after login
    setAcceptInviteAfterLogin (state, { token }) {
      state.acceptInviteAfterLogin = token
    },
    clearAcceptInviteAfterLogin (state) {
      state.acceptInviteAfterLogin = null
    },

    // Mute conversation after login
    appendMuteConversationAfterLogin (state, { conversationId }) {
      state.muteConversationAfterLogin.push(conversationId)
    },
    clearMuteConversationAfterLogin (state) {
      state.muteConversationAfterLogin = []
    },

    setFailedEmailDeliveries (state, events) {
      state.failedEmailDeliveries = events
    },

    setMaybeLoggedOut (state, value) {
      if (state.user) {
        state.maybeLoggedOut = value
      }
      else {
        state.maybeLoggedOut = false
      }
    },
  },
}

export function plugin (store) {
  store.watch(state => state.auth.maybeLoggedOut, async (maybeLoggedOut) => {
    if (maybeLoggedOut) {
      await store.dispatch('auth/refresh')
    }
  })
}
