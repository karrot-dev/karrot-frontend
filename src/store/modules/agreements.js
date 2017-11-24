import Vue from 'vue'
import agreements from '@/services/api/agreements'
import { createMetaModule, withMeta } from '@/store/helpers'

function initialState () {
  return {
    entries: {},
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: state => id => state.entries[id],
  },
  actions: {
    ...withMeta({
      async fetch ({ commit }, id) {
        commit('set', await agreements.get(id))
      },
      async agree ({ commit }, id) {
        commit('set', await agreements.agree(id))
      },
      async create ({ commit }, agreement) {
        agreement = await agreements.create(agreement)
        commit('set', agreement)
        return agreement
      },
      async save ({ commit }, agreement) {
        agreement = await agreements.save(agreement)
        commit('set', agreement)
        return agreement
      },
    }),
  },
  mutations: {
    set (state, agreement) {
      Vue.set(state.entries, agreement.id, agreement)
    },
  },
}
