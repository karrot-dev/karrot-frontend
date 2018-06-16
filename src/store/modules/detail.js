import pickupsAPI from '@/services/api/pickups'

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
    async selectPickup ({ commit, dispatch }, { pickupId }) {
      const conversation = await pickupsAPI.conversation(pickupId)
      commit('setPickupId', pickupId)
      commit('setConversationId', conversation.id)
      dispatch('pickups/fetch', pickupId, { root: true })
      dispatch('conversations/fetchConversation', conversation.id, { root: true })
      dispatch('conversations/fetch', conversation.id, { root: true }) // gets the messages
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
