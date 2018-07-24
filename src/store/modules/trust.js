import Vue from 'vue'
import trustAPI from '@/services/api/trust'
import { indexById, withMeta, createMetaModule, metaStatuses } from '@/store/helpers'

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
    enrich: (state, getters, rootState, rootGetters) => trust => {
      return {
        ...trust,
        givenBy: rootGetters['users/get'](trust.givenBy),
      }
    },
    all: (state, getters) => Object.values(state.entries).map(getters.enrich),
    ...metaStatuses(['create']),
  },
  actions: {
    ...withMeta({
      async create ({ commit }, data) {
        const trust = await trustAPI.create(data)
        commit('update', trust)
      },
    }),

    async fetchForGroup ({ commit }, { groupId }) {
      commit('set', await trustAPI.listByGroupId(groupId))
    },

    async fetchForUser ({ commit }, userId) {
      commit('set', await trustAPI.listByUserId(userId))
    },
  },
  mutations: {
    set (state, groups) {
      state.entries = indexById(groups)
    },
    update (state, group) {
      Vue.set(state.entries, group.id, group)
    },
  },
}
