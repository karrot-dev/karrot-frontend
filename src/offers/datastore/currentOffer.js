import offers from '@/offers/api/offers'
import { createMetaModule, withMeta } from '@/utils/datastore/helpers'

function initialState () {
  return {
    current: null,
    id: null,
  }
}

export default {
  namespaced: true,
  modules: {
    meta: createMetaModule(),
  },
  state: initialState(),
  getters: {
    value: (state, getters, rootState, rootGetters) => {
      return rootGetters['offers/enrich'](state.current)
    },
    id: state => state.id,
    conversation: (state, getters, rootState, rootGetters) => {
      if (!state.current) return
      return rootGetters['conversations/getForOffer'](state.current.id)
    },
    fetching (state, getters) {
      if (!state.id) return
      const status = getters['meta/status']('fetch', state.id)
      return status && status.pending
    },
    saveStatus: (state, getters) => {
      const currentOffer = getters.value
      return currentOffer && currentOffer.saveStatus
    },
  },
  actions: {
    ...withMeta({
      async fetch ({ state, commit, dispatch }, offerId) {
        commit('setId', offerId)
        const offer = await offers.get(offerId)

        // aborting, another offer has been loaded while we waited
        if (state.id !== offerId) return
        commit('set', offer)
      },
    }),
    refresh ({ state, dispatch }) {
      if (state.current) {
        dispatch('fetch', state.current.id)
      }
    },
    clear ({ commit }) {
      commit('clear')
    },
    ...withMeta({
      async select ({ dispatch, commit }, { offerId }) {
        await dispatch('fetch', offerId)
        dispatch('conversations/fetchForOffer', { offerId }, { root: true })
      },
    }, {
      setCurrentId: ({ commit }, { offerId }) => commit('setId', offerId),
      getCurrentId: ({ state }) => state.id,
      findId: ({ offerId }) => offerId,
    }),
  },
  mutations: {
    setId (state, value) {
      state.id = value
    },
    set (state, offer) {
      state.current = Object.freeze(offer)
    },
    clear (state) {
      Object.assign(state, initialState())
    },
    update (state, offer) {
      if (state.id === offer.id) {
        state.current = Object.freeze(offer)
      }
    },
    delete (state, offerId) {
      if (state.id === offerId) Object.assign(state, initialState())
    },
  },
}
