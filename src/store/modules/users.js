import Vue from 'vue'
import users from '@/services/api/users'
import authUser from '@/services/api/authUser'
import auth from '@/services/api/auth'
import { indexById, createRouteError, createMetaModule, withMeta, metaStatuses } from '@/store/helpers'

function initialState () {
  return {
    entries: {},
    idList: [],
    activeUserId: null,
    resetPasswordSuccess: false,
    resendVerificationSuccess: false,
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
        __unenriched: user,
      } : {
        isCurrentUser: false,
      }
    },
    all: (state, getters, rootState, rootGetters) => {
      return state.idList.map(getters.get)
    },
    byCurrentGroup: (state, getters, rootState, rootGetters) => {
      const currentGroup = rootGetters['currentGroup/value']
      return (currentGroup && currentGroup.members) ? currentGroup.members.map(getters.get) : []
    },
    activeUser: (state, getters, rootState, rootGetters) => {
      return state.activeUserId && getters.get(state.activeUserId)
    },
    activeUserId: state => state.activeUserId,
    ...metaStatuses(['signup', 'resetPassword', 'resendVerification']),
    resetPasswordSuccess: state => state.resetPasswordSuccess,
    resendVerificationSuccess: state => state.resendVerificationSuccess,
  },
  actions: {
    ...withMeta({
      async fetch ({ commit }) {
        commit('set', await users.list())
      },
      async signup ({ commit, dispatch }, userData) {
        await authUser.create(userData)
        dispatch('auth/login', { email: userData.email, password: userData.password }, { root: true })
      },
      async resetPassword ({ commit }, email) {
        await auth.resetPassword(email)
        commit('resetPasswordSuccess', true)
      },
      async resendVerification ({ commit, state }) {
        await auth.resendVerificationRequest()
        commit('resendVerificationSuccess', true)
      },
    }),

    async selectUser ({ commit, getters, dispatch }, { userId }) {
      if (!getters.get(userId).id) {
        try {
          const user = await users.get(userId)
          commit('update', user)
        }
        catch (error) {
          const data = { translation: 'PROFILE.INACCESSIBLE_OR_DELETED' }
          throw createRouteError(data)
        }
      }
      commit('select', userId)
      await dispatch('history/fetchForUser', { userId }, { root: true })
    },
    clearSelectedUser ({ commit }) {
      commit('select', null)
    },
    clearSignup ({ commit, dispatch }) {
      dispatch('meta/clear', ['signup'])
    },
    clearResendVerification ({ commit, dispatch }) {
      dispatch('meta/clear', ['resendVerification'])
      commit('resendVerificationSuccess', false)
    },
    clearResetPassword ({ commit, dispatch }) {
      dispatch('meta/clear', ['resetPassword'])
      commit('resetPasswordSuccess', false)
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
    resetPasswordSuccess (state, status) {
      Vue.set(state, 'resetPasswordSuccess', status)
    },
    resendVerificationSuccess (state, status) {
      Vue.set(state, 'resendVerificationSuccess', status)
    },

  },
}
