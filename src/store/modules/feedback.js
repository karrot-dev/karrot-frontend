import Vue from 'vue'
import router from '@/router'
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

        // Fetch related pickups
        for (const f of data.results) {
          dispatch('pickups/maybeFetch', f.about, { root: true })
        }
      },

      async save ({ commit, state }, feedback) {
        const entry = await feedbackAPI.create(feedback)
        commit('update', { entries: [entry], cursor: state.cursor })
        router.push({ name: 'groupFeedback' })
      },
    }),

    async fetchForGroup ({ commit, dispatch, rootGetters }, { groupId }) {
      dispatch('fetchFiltered', { group: groupId })
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
    update (state, { entries, cursor }) {
      state.entries = {
        ...state.entries,
        ...indexById(entries),
      }
      // simple insertion sort for new entries
      // assumes that state.entries are sorted AND incoming entries are sorted
      const newIds = entries.map(e => e.id).filter(e => !state.idList.includes(e))
      let i = 0
      for (let id of newIds) {
        const createdAt = state.entries[id].createdAt
        while (i < state.idList.length && state.entries[state.idList[i]].createdAt > createdAt) i++
        state.idList.splice(i, 0, id)
      }
      state.cursor = cursor
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
