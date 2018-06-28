import { Platform } from 'quasar'

import { createRouteRedirect } from '@/store/helpers'

function initialState () {
  return {
    pickupId: null,
    userId: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    isActive: state => {
      return Boolean(state.pickupId || state.userId)
    },
    pickup: (state, getters, rootState, rootGetters) => {
      if (!state.pickupId) return
      return rootGetters['pickups/get'](state.pickupId)
    },
    user: (state, getters, rootState, rootGetters) => {
      if (!state.userId) return
      return rootGetters['users/get'](state.userId)
    },
    conversation: (state, getters, rootState, rootGetters) => {
      if (state.pickupId) {
        return rootGetters['conversations/getForPickup'](state.pickupId)
      }
      else if (state.userId) {
        return rootGetters['conversations/getForUser'](state.userId)
      }
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
    selectPickup ({ getters, commit, dispatch }, { pickupId }) {
      if (getters.user) commit('setUserId', null)
      commit('setPickupId', pickupId)
      dispatch('conversations/fetchForPickup', { pickupId }, { root: true })
    },
    selectUser ({ getters, commit, dispatch }, { userId }) {
      if (getters.pickup) commit('setPickupId', null)
      commit('setUserId', userId)
      dispatch('conversations/fetchForUser', { userId }, { root: true })
    },
    clear ({ dispatch, state, commit }) {
      const { pickupId, userId } = state
      if (pickupId) {
        dispatch('conversations/clearForPickup', { pickupId }, { root: true })
      }
      if (userId) {
        dispatch('conversations/clearForUser', { userId }, { root: true })
      }
      commit('clear')
    },
  },
  mutations: {
    setPickupId (state, pickupId) {
      state.pickupId = pickupId
    },
    setUserId (state, userId) {
      state.userId = userId
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
