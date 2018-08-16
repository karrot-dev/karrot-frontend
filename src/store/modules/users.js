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
    get: (state, getters, rootState, rootGetters) => userId => {
      return getters.enrich(state.entries[userId])
    },
    enrich: (state, getters, rootState, rootGetters) => user => {
      if (!user) {
        return {
          isCurrentUser: false,
        }
      }
      const authUserId = rootGetters['auth/userId']
      const membership = rootGetters['currentGroup/memberships'][user.id]

      return {
        ...user,
        isCurrentUser: user.id === authUserId,
        membership,
      }
    },
    all: (state, getters, rootState, rootGetters) => {
      return state.idList.map(getters.get)
    },
    byCurrentGroup: (state, getters, rootState, rootGetters) => {
      return getters.all.filter(u => u.membership)
    },
    activeUser: (state, getters, rootState, rootGetters) => {
      if (!state.activeUserProfile) return

      const user = state.activeUserProfile

      const groups = user.memberships && Object.entries(user.memberships).map(([groupId, membership]) => ({
        ...rootGetters['groups/get'](groupId),
        membership: getters.enrichMembership(membership),
      })).sort((a, b) => a.name.localeCompare(b.name))

      return {
        ...getters.enrich(user),
        groups,
      }
    },
    enrichMembership: (state, getters, rootState, rootGetters) => membership => {
      if (!membership) return
      const authUserId = rootGetters['auth/userId']
      return {
        ...membership,
        isEditor: membership.roles.includes('editor'),
        // Do not enrich trustedBy, as it would lead to cyclic dependencies
        // trustedBy: membership.trustedBy.map(getters.get),
        trusted: membership.trustedBy.includes(authUserId),
      }
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

    async selectUser ({ state, commit, dispatch, rootGetters }, { userId }) {
      if (!state.activeUserProfile) {
        try {
          commit('setProfile', await users.getProfile(userId))
        }
        catch (error) {
          const data = { translation: 'PROFILE.INACCESSIBLE_OR_DELETED' }
          throw createRouteError(data)
        }
      }
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

export const plugin = store => {
  // keep dependent data for user profile updated, even when switching groups
  // the watch fires too often, so we better to keep track what we last loaded to avoid concurrent requests
  let lastLoadedGroupId = null
  store.watch(state => ({
    groupId: state.auth.user && state.auth.user.currentGroup,
    profileUserId: state.users.activeUserProfile && state.users.activeUserProfile.id,
  }), ({ groupId, profileUserId }) => {
    if (profileUserId && groupId && lastLoadedGroupId !== groupId) {
      lastLoadedGroupId = groupId
      store.dispatch('currentGroup/selectFromCurrentUser')
      store.dispatch('history/fetchForUserInGroup', { userId: profileUserId, groupId })
    }
    if (!profileUserId) {
      lastLoadedGroupId = null
    }
  })
}
