import Vue from 'vue'
import agreements from '@/agreements/api/agreements'
import { createMetaModule, withMeta } from '@/utils/datastore/helpers'

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
        commit('update', [await agreements.get(id)])
      },
      async agree ({ commit }, id) {
        commit('update', [await agreements.agree(id)])
      },
      async create ({ commit }, agreement) {
        agreement = await agreements.create(agreement)
        commit('update', [agreement])
        return agreement
      },
      async save ({ commit }, agreement) {
        agreement = await agreements.save(agreement)
        commit('update', [agreement])
        return agreement
      },
    }),
  },
  mutations: {
    update (state, agreements) {
      for (const agreement of agreements) {
        Vue.set(state.entries, agreement.id, agreement)
      }
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
