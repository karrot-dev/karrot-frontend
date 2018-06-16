import { Platform } from 'quasar'

import router from '@/router'
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
    async routeEnter ({ dispatch, rootGetters }, { pickupId }) {
      await dispatch('selectPickup', { pickupId })
      const pickup = rootGetters['pickups/get'](pickupId)
      const groupId = pickup.store.group
      if (Platform.is.mobile) {
        dispatch('currentGroup/select', { groupId }, { root: true })
      }
      else {
        router.push({ name: 'group', params: { groupId } })
      }
    },
    routeLeave ({ dispatch }) {
      if (Platform.is.mobile) dispatch('clear')
    },
    async selectPickup ({ commit, dispatch }, { pickupId }) {
      const [conversation] = await Promise.all([
        pickupsAPI.conversation(pickupId),
        dispatch('pickups/fetch', pickupId, { root: true }),
      ])
      dispatch('conversations/fetchConversation', conversation.id, { root: true })
      dispatch('conversations/fetch', conversation.id, { root: true }) // gets the messages
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
