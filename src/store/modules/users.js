import Vue from 'vue'
import users from '@/services/api/users'
import authUser from '@/services/api/authUser'
import auth from '@/services/api/auth'
import { indexById, createRouteError, createMetaModule, withMeta, metaStatuses } from '@/store/helpers'
import router from '@/router'

function initialState () {
  return {
    entries: {},
    idList: [],
    activeUserProfile: null,
    resetPasswordSuccess: false,
    resendVerificationCodeSuccess: false,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: (state, getters) => userId => {
      return getters.enrich(state.entries[userId])
    },
    enrich: (state, getters, rootState, rootGetters) => user => {
      if (!user) {
        return {
          isCurrentUser: false,
        }
      }
      const authUserId = rootGetters['auth/userId']
      const currentGroup = rootGetters['currentGroup/value']

      // should be renamed into membershipincurrentgroup or removed
      const membership = currentGroup && currentGroup.memberships && currentGroup.memberships[user.id]

      const memberships = user.memberships && Object.entries(user.memberships).map(([groupId, membership]) => ({
        ...membership,
        group: rootGetters['groups/get'](groupId),
        trustedBy: membership.trustedBy.map(rootGetters['users/get']),
        trusted: membership.trustedBy.includes(authUserId),
      })).sort((a, b) => a.group.name.localeCompare(b.group.name))
      return {
        ...user,
        isCurrentUser: user.id === authUserId,
        isEditor: membership && membership.roles.includes('editor'),
        memberships,
      }
    },
    all: (state, getters, rootState, rootGetters) => {
      return state.idList.map(getters.get)
    },
    byCurrentGroup: (state, getters, rootState, rootGetters) => {
      const currentGroup = rootGetters['currentGroup/value']
      if (currentGroup && currentGroup.memberships) {
        return Object.entries(currentGroup.memberships).map(([userId, membership]) => {
          userId = parseInt(userId)
          return {
            ...getters.get(userId),
            membershipInCurrentGroup: {
              ...membership,
              trustedBy: membership.trustedBy.map(rootGetters['users/get']),
              trustProgress: membership.roles.includes('editor') ? 1 : membership.trustedBy.length / currentGroup.trustThresholdForNewcomer,
            },
          }
        })
      }
      return []
    },
    activeUser: (state, getters, rootState, rootGetters) => {
      return state.activeUserProfile && getters.enrich(state.activeUserProfile)
    },
    activeUserId: state => state.activeUserProfile && state.activeUserProfile.id,
    ...metaStatuses(['signup', 'requestResetPassword', 'resetPassword', 'resendVerificationCode', 'requestDeleteAccount']),
    resetPasswordSuccess: state => state.resetPasswordSuccess,
    resendVerificationCodeSuccess: state => state.resendVerificationCodeSuccess,
  },
  actions: {
    ...withMeta({
      async fetch ({ commit }) {
        commit('set', await users.list())
      },
      async signup ({ commit, dispatch }, { userData, joinPlayground }) {
        await authUser.create(userData)
        await dispatch('auth/login', { email: userData.email, password: userData.password }, { root: true })
        if (joinPlayground) {
          await dispatch('groups/joinPlayground', null, { root: true })
        }
      },
      async requestResetPassword ({ commit }, email) {
        await auth.requestResetPassword(email)
        router.push({ name: 'requestPasswordResetSuccess' })
      },
      async resetPassword ({ commit, dispatch, getters }, data) {
        await auth.resetPassword(data)
        router.push({ name: 'login' })
        dispatch('toasts/show', {
          message: 'PASSWORD.RESET.SUCCESS',
        }, { root: true })
      },
      async resendVerificationCode ({ commit, state }) {
        await auth.resendVerificationCode()
        commit('resendVerificationCodeSuccess', true)
      },
      async requestDeleteAccount ({ dispatch }) {
        await users.requestDeleteAccount()
        dispatch('toasts/show', {
          message: 'USERDATA.REQUEST_DELETE_ACCOUNT.SUCCESS',
        }, { root: true })
        dispatch('auth/logout', {}, { root: true })
      },
    }),

    async selectUser ({ state, commit, dispatch }, { userId }) {
      if (!state.activeUserProfile) {
        try {
          commit('setProfile', await users.getProfile(userId))
        }
        catch (error) {
          const data = { translation: 'PROFILE.INACCESSIBLE_OR_DELETED' }
          throw createRouteError(data)
        }
      }
      dispatch('history/fetchForUser', { userId }, { root: true })
    },
    async update ({ state, commit }, user) {
      commit('update', user)
      if (state.activeUserProfile && state.activeUserProfile.id === user.id) {
        commit('setProfile', await users.getProfile(user.id))
      }
    },
    clearSelectedUser ({ commit }) {
      commit('setProfile', null)
    },
    clearSignup ({ commit, dispatch }) {
      dispatch('meta/clear', ['signup'])
    },
    clearResendVerificationCode ({ commit, dispatch }) {
      dispatch('meta/clear', ['resendVerificationCode'])
      commit('resendVerificationCodeSuccess', false)
    },
    clearResetPassword ({ commit, dispatch }) {
      dispatch('meta/clear', ['resetPassword'])
      commit('resetPasswordSuccess', false)
    },
    async refresh ({ state, dispatch, commit }, { userId } = {}) {
      if (userId) {
        const user = await users.get(userId)
        commit('update', user)
      }
      else {
        dispatch('fetch')
      }
      if (state.activeUserProfile) {
        commit('setProfile', await users.getProfile(userId))
      }
    },
  },
  mutations: {
    setProfile (state, userProfile) {
      state.activeUserProfile = userProfile
    },
    set (state, users) {
      state.entries = indexById(users)
      state.idList = users.map(e => e.id)
    },
    update (state, user) {
      Vue.set(state.entries, user.id, user)
      if (!state.idList.includes(user.id)) {
        state.idList.push(user.id)
      }
    },
    resendVerificationCodeSuccess (state, status) {
      Vue.set(state, 'resendVerificationCodeSuccess', status)
    },

  },
}
