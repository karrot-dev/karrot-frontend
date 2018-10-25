import Vue from 'vue'
import users from '@/users/api/users'
import { createMetaModule, withMeta, metaStatuses } from '@/utils/datafoo/helpers'

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
    ...metaStatuses(['deleteAccount']),
  },
  actions: {
    ...withMeta({
      async deleteAccount ({ commit }, code) {
        await users.deleteAccount(code)
        commit('setSuccess', true)
      },
    }),
    clear ({ commit, dispatch }) {
      dispatch('meta/clear', ['deleteAccount'])
      commit('setSuccess', false)
    },
  },
  mutations: {
    setSuccess (state, status) {
      Vue.set(state, 'success', status)
    },
  },
}
