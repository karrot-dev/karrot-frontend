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
    activeUserId: null,
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
      const authUserId = rootGetters['auth/userId']
      return user ? {
        ...user,
        isCurrentUser: user.id === authUserId,
      } : {
        isCurrentUser: false,
      }
    },
    all: (state, getters, rootState, rootGetters) => {
      return state.idList.map(getters.get)
    },
    byCurrentGroup: (state, getters, rootState, rootGetters) => {
      const currentGroup = rootGetters['currentGroup/value']
      if (currentGroup && currentGroup.memberships) {
        return Object.entries(currentGroup.memberships).map(([userId, membership]) => {
          return {
            ...getters.get(userId),
            membershipInCurrentGroup: membership,
          }
        })
      }
      return []
    },
    activeUser: (state, getters, rootState, rootGetters) => {
      return state.activeUserId && getters.get(state.activeUserId)
    },
    activeUserId: state => state.activeUserId,
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

    async selectUser ({ commit, getters, dispatch }, { userId }) {
      if (!getters.get(userId).id) {
        try {
          await dispatch('refresh', { userId })
        }
        catch (error) {
          const data = { translation: 'PROFILE.INACCESSIBLE_OR_DELETED' }
          throw createRouteError(data)
        }
      }
      commit('select', userId)
      await dispatch('history/fetchForUser', { userId }, { root: true })
    },
    update ({ commit }, user) {
      commit('update', user)
    },
    clearSelectedUser ({ commit }) {
      commit('select', null)
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
    async refresh ({ dispatch, commit }, { userId } = {}) {
      if (userId) {
        const user = await users.get(userId)
        commit('update', user)
      }
      else {
        dispatch('fetch')
      }
    },
  },
  mutations: {
    select (state, userId) {
      state.activeUserId = userId
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
