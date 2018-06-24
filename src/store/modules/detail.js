import { Platform } from 'quasar'

import { createRouteRedirect } from '@/store/helpers'

function initialState () {
  return {
    pickupId: null,
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
      if (!state.pickupId) return
      return rootGetters['conversations/getForPickup'](state.pickupId)
    },
  },
  actions: {
    routeEnter ({ dispatch }, { groupId, storeId, pickupId, routeTo }) {
      dispatch('selectPickup', { pickupId })
      if (!Platform.is.mobile) {
        // On desktop we don't have a pickup detail page, we go to the store page, and have a sidebar open
        throw createRouteRedirect({ name: 'store', params: { groupId, storeId }, query: routeTo.query })
      }
    },
    routeLeave ({ dispatch }) {
      dispatch('clear')
    },
    selectPickup ({ commit, dispatch }, { pickupId }) {
      commit('setPickupId', pickupId)
      dispatch('conversations/fetchForPickup', { pickupId }, { root: true })
    },
    clear ({ dispatch, state, commit }) {
      const { pickupId } = state
      dispatch('conversations/clearForPickup', { pickupId }, { root: true })
      commit('clear')
    },
  },
  mutations: {
    setPickupId (state, pickupId) {
      state.pickupId = pickupId
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
