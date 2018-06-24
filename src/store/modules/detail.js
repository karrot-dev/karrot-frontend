import { Platform } from 'quasar'

import { createRouteRedirect } from '@/store/helpers'

function initialState () {
  return {
    pickupId: null,
    conversationId: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    isActive: state => {
      return !!state.pickupId
    },
    pickup: (state, getters, rootState, rootGetters) => {
      if (!state.pickupId) return
      return rootGetters['pickups/get'](state.pickupId)
    },
    conversation: (state, getters, rootState, rootGetters) => {
      if (!state.conversationId) return
      return rootGetters['conversations/get'](state.conversationId)
    },
  },
  actions: {
    async routeEnter ({ dispatch }, { groupId, storeId, pickupId, routeTo }) {
      await dispatch('selectPickup', { pickupId })
      if (!Platform.is.mobile) {
        // On desktop we don't have a pickup detail page, we go to the store page, and have a sidebar open
        throw createRouteRedirect({ name: 'store', params: { groupId, storeId }, query: routeTo.query })
      }
    },
    routeLeave ({ dispatch }) {
      if (Platform.is.mobile) dispatch('clear')
    },
    async selectPickup ({ commit, dispatch }, { pickupId }) {
      const conversation = await dispatch('conversations/fetchPickupConversation', pickupId, { root: true })
      await dispatch('conversations/fetch', conversation.id, { root: true })
      commit('setPickupId', pickupId)
      commit('setConversationId', conversation.id)
    },
    clear ({ commit }) {
      commit('clear')
    },
  },
  mutations: {
    setPickupId (state, pickupId) {
      state.pickupId = pickupId
    },
    setConversationId (state, conversationId) {
      state.conversationId = conversationId
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
