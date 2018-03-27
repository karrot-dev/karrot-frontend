import auth from '@/services/api/auth'
import authUser from '@/services/api/authUser'
import router from '@/router'
import { createMetaModule, withMeta, metaStatuses } from '@/store/helpers'

function initialState () {
  return {
    user: null,
    redirectTo: null,
    joinGroupAfterLogin: null,
    acceptInviteAfterLogin: null,
    muteConversationAfterLogin: [],
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    isLoggedIn: state => !!state.user,
    user: state => state.user,
    userId: state => state.user && state.user.id,
    redirectTo: state => state.redirectTo,
    hasJoinGroupAfterLogin: state => Boolean(state.joinGroupAfterLogin),
    ...metaStatuses(['login', 'save', 'changePassword', 'changeEmail']),
  },
  actions: {
    clearLoginStatus: ({ dispatch }) => dispatch('meta/clear', ['login']),

    ...withMeta({

      async check ({ commit, dispatch }) {
        try {
          commit('setUser', { user: await authUser.get() })
          dispatch('afterLoggedIn')
        }
        catch (error) {
          commit('clearUser')
          throw error
        }
      },

      async login ({ state, commit, getters, dispatch, rootGetters }, data) {
        const user = await auth.login(data)
        commit('setUser', { user })
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
          const joinParams = state.joinGroupAfterLogin
          const group = () => rootGetters['groups/get'](joinParams.id)
          if (group().isMember) {
            // go to group if already a member
            router.push({ name: 'group', params: { groupId: joinParams.id } })
          }
          else {
            await dispatch('groups/join', joinParams, { root: true })
            if (group().joinStatus.hasValidationErrors) {
              // go back to goup preview if error occured
              // it should show the error status on group preview, thanks to persistent state!
              router.push({ name: 'groupPreview', params: { groupPreviewId: joinParams.id } })
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

      async logout ({ commit }) {
        commit('clearUser', { user: await auth.logout() })
        router.push({ name: 'groupsGallery' })
      },

      async changePassword ({ commit, state, dispatch }, data) {
        await auth.changePassword(data)
        dispatch('logout')
      },

      async changeEmail ({ commit, dispatch }, email) {
        const savedUser = await authUser.save({ email })
        commit('setUser', { user: savedUser })
        router.push({ name: 'user', params: { userId: savedUser.id } })
      },
    }),

    ...withMeta({
      async save ({ dispatch }, data) {
        const savedUser = await dispatch('backgroundSave', data)
        router.push({ name: 'user', params: { userId: savedUser.id } })
      },
    }, {
      // ignore ID to have simple saveStatus
      findId: () => undefined,
    }),

    async backgroundSave ({ commit, state, dispatch }, data) {
      const savedUser = await authUser.save(data)
      commit('setUser', { user: savedUser })
      dispatch('users/update', savedUser, { root: true })
      return savedUser
    },

    setRedirectTo ({ commit }, redirectTo) {
      commit('setRedirectTo', { redirectTo })
    },

    setJoinGroupAfterLogin ({ commit }, joinParams) {
      commit('setJoinGroupAfterLogin', { joinParams })
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
      commit('setUser', { user })
    },

    clearSettingsStatus ({ commit, dispatch }) {
      dispatch('meta/clear', ['changeEmail'])
      dispatch('meta/clear', ['changePassword'])
      dispatch('meta/clear', ['save'])
      dispatch('users/clearResendVerification', null, { root: true })
    },
  },
  mutations: {
    setUser (state, { user }) {
      state.user = user
    },
    clearUser (state) {
      state.user = null
    },

    // Redirect
    setRedirectTo (state, { redirectTo }) {
      state.redirectTo = redirectTo
    },
    clearRedirectTo (state) {
      state.redirectTo = null
    },

    // Group to join after login
    setJoinGroupAfterLogin (state, { joinParams }) {
      state.joinGroupAfterLogin = joinParams
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
  },
}
