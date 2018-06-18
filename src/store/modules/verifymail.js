import Vue from 'vue'
import auth from '@/services/api/auth'
import { createMetaModule, withMeta, metaStatuses } from '@/store/helpers'

function initialState () {
  return {
    success: false,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    success: state => state.success,
    ...metaStatuses(['verify']),
  },
  actions: {
    ...withMeta({
      async verify ({ commit, dispatch, rootGetters }, code) {
        await auth.verifyMail(code)
        commit('setSuccess', true)
        if (rootGetters['auth/isLoggedIn']) {
          dispatch('users/refresh', { userId: rootGetters['auth/userId'] }, { root: true })
          dispatch('auth/refresh', null, { root: true })
        }
      },
    }),
    clear ({ commit, dispatch }) {
      dispatch('meta/clear', ['verify'])
      commit('setSuccess', false)
    },
  },
  mutations: {
    setSuccess (state, status) {
      Vue.set(state, 'success', status)
    },
  },
}
