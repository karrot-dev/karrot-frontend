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
    routeEnter ({ dispatch, rootGetters }, { groupId, storeId, pickupId, userId, routeTo }) {
      if (pickupId) {
        dispatch('selectPickup', { pickupId })
        if (!Platform.is.mobile) {
          // On desktop we don't have a pickup detail page, we go to the store page, and have a sidebar open
          throw createRouteRedirect({ name: 'store', params: { groupId, storeId }, query: routeTo.query })
        }
      }
      else if (userId) {
        // conversation with yourself is not implemented
        if (rootGetters['auth/userId'] !== userId) {
          dispatch('selectUser', { userId })
          if (!Platform.is.mobile) {
            // On desktop we don't have a user detail page, we go to the user page, and have a sidebar open
            throw createRouteRedirect({ name: 'user', params: { userId }, query: routeTo.query })
          }
        }
        else {
          throw createRouteRedirect({ name: 'user', params: { userId }, query: routeTo.query })
        }
      }
    },
    routeLeave ({ dispatch }) {
      dispatch('clear')
    },
    selectPickup ({ state, commit, dispatch }, { pickupId }) {
      if (state.userId) commit('setUserId', null)
      commit('setPickupId', pickupId)
      dispatch('conversations/fetchForPickup', { pickupId }, { root: true })
    },
    selectUser ({ state, commit, dispatch }, { userId }) {
      if (state.pickupId) commit('setPickupId', null)
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
