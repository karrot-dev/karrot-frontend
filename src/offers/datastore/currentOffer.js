/**
 *  currentOffer store module
 *
 *  With the move to vue-query this now only stores the id of the
 *  currently selected offer, which is used to fetch the conversation.
 *
 *  The rest of the offer data is managed using vue-query.
 *
 *  When conversations have moved to vue-query this module can go away.
 */

import { createMetaModule, withMeta } from '@/utils/datastore/helpers'

function initialState () {
  return {
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
    conversation: (state, getters, rootState, rootGetters) => {
      if (!state.id) return
      return rootGetters['conversations/getForOffer'](state.id)
    },
  },
  actions: {
    clear ({ commit }) {
      commit('clear')
    },
    ...withMeta({
      async select ({ dispatch, commit }, { offerId }) {
        // clear right drawer
        // TODO can be removed once detail are bound to routes
        dispatch('detail/clear', null, { root: true })
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
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

export const plugin = datastore => {
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('currentOffer/clear')
    }
  })
}
