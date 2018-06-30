import { Platform } from 'quasar'

import { createRouteRedirect } from '@/store/helpers'
import router from '@/router'

function initialState () {
  return {
    scope: { type: null, id: null },
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    isActive: (state, getters) => {
      const { conversation } = getters
      if (!conversation) return false
      return conversation.fetchStatus.isPending || Boolean(conversation.id)
    },
    pickup: (state, getters, rootState, rootGetters) => {
      const { type, id } = state.scope
      if (type !== 'pickup') return
      return rootGetters['pickups/get'](id)
    },
    user: (state, getters, rootState, rootGetters) => {
      const { type, id } = state.scope
      if (type !== 'user') return
      return rootGetters['users/get'](id)
    },
    conversation: (state, getters, rootState, rootGetters) => {
      const { type, id } = state.scope
      if (type === 'pickup') {
        return rootGetters['conversations/getForPickup'](id)
      }
      else if (type === 'user') {
        return rootGetters['conversations/getForUser'](id)
      }
    },
  },
  actions: {
    routeEnter ({ dispatch, rootGetters }, { groupId, storeId, pickupId, userId, routeTo }) {
      if (pickupId) {
        dispatch('selectPickup', pickupId)
        if (!Platform.is.mobile) {
          // On desktop we don't have a pickup detail page, we go to the store page, and have a sidebar open
          throw createRouteRedirect({ name: 'store', params: { groupId, storeId }, query: routeTo.query })
        }
      }
      else if (userId) {
        // conversation with yourself is not implemented
        if (rootGetters['auth/userId'] !== userId) {
          dispatch('selectUser', userId)
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
    openForPickup ({ dispatch }, pickup) {
      if (Platform.is.mobile) {
        router.push({ name: 'pickupDetail', params: { storeId: pickup.store.id, pickupId: pickup.id } })
      }
      else {
        dispatch('selectPickup', pickup.id)
      }
    },
    openForUser ({ dispatch }, user) {
      if (Platform.is.mobile) {
        router.push({ name: 'userDetail', params: { userId: user.id } })
      }
      else {
        dispatch('selectUser', user.id)
      }
    },
    async selectPickup ({ commit, dispatch }, pickupId) {
      dispatch('clear')
      commit('setPickupId', pickupId)
      dispatch('conversations/fetchForPickup', { pickupId }, { root: true })
    },
    async selectUser ({ commit, dispatch }, userId) {
      dispatch('clear')
      commit('setUserId', userId)
      dispatch('conversations/fetchForUser', { userId }, { root: true })
    },
    clear ({ dispatch, state, commit }) {
      const { type, id } = state.scope
      if (type === 'pickup') {
        dispatch('conversations/clearForPickup', { pickupId: id }, { root: true })
      }
      else if (type === 'user') {
        dispatch('conversations/clearForUser', { userId: id }, { root: true })
      }
      commit('clear')
    },
  },
  mutations: {
    setPickupId (state, pickupId) {
      state.scope = { type: 'pickup', id: pickupId }
    },
    setUserId (state, userId) {
      state.scope = { type: 'user', id: userId }
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
