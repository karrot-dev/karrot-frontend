import Vue from 'vue'
import feedbackAPI from '@/services/api/feedback'
import { indexById, createMetaModule, withMeta, metaStatuses } from '@/store/helpers'

function initialState () {
  return {
    entries: {},
    idList: [],
    storeFilter: null,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => id => {
      return getters.enrich(state.entries[id])
    },
    enrich: (state, getters, rootState, rootGetters) => feedback => {
      return feedback && {
        ...feedback,
        givenBy: rootGetters['users/get'](feedback.givenBy),
        about: rootGetters['pickups/get'](feedback.about),
      }
    },
    all: (state, getters) => state.idList.map(getters.get),
    filtered: (state, getters, rootState, rootGetters) => {
      let stores = rootGetters['stores/all']
      if (state.storeFilter) {
        stores = [state.storeFilter]
      }
      return getters.all.filter(e => e.about && stores.includes(e.about.store.id))
    },
    ...metaStatuses(['save']),
  },
  actions: {
    ...withMeta({
      async fetchFiltered ({ dispatch, commit }, filters) {
        dispatch('clear')
        const data = await feedbackAPI.list(filters)
        commit('update', { entries: data.results, cursor: data.next })
      },

      /**
       * Fetch existing feedback
       */
      async fetch ({ commit, dispatch, getters }) {
        const feedback = (await feedbackAPI.list()).results
        commit('set', feedback)

        // Fetch related pickups
        for (const f of feedback) {
          // TODO don't refetch existing pickups
          dispatch('pickups/fetch', f.about, { root: true })
        }
      },

      async save ({ commit, dispatch }, feedback) {
        await feedbackAPI.create(feedback)
        dispatch('fetch')
      },
    }),

    async fetchForGroup ({ commit, dispatch, rootGetters }, { groupId }) {
      dispatch('fetch')
    },
    async setStoreFilter ({ commit }, { storeId }) {
      commit('setStoreFilter', storeId)
    },
    async clearStoreFilter ({ commit }) {
      commit('setStoreFilter', null)
    },

    /**
     * Reset all state
     */
    clear ({ commit }) {
      commit('clear')
    },

  },
  mutations: {
    set (state, list) {
      state.entries = indexById(list)
      state.idList = list.map(e => e.id)
    },
    setStoreFilter (state, storeId) {
      state.storeFilter = storeId
    },
    clear (state) {
      Object.entries(initialState())
        .forEach(([prop, value]) => Vue.set(state, prop, value))
    },
  },
}
