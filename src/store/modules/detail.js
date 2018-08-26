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
    application: (state, getters, rootState, rootGetters) => {
      const { type, id } = state.scope
      if (type !== 'application') return
      return rootGetters['groupApplications/get'](id)
    },
    conversation: (state, getters, rootState, rootGetters) => {
      const { type, id } = state.scope
      if (type === 'pickup') {
        return rootGetters['conversations/getForPickup'](id)
      }
      if (type === 'user') {
        return rootGetters['conversations/getForUser'](id)
      }
      if (type === 'application') {
        return rootGetters['conversations/getForApplication'](id)
      }
      if (type === 'thread') {
        return rootGetters['currentThread/get']
      }
    },
  },
  actions: {
    routeEnter ({ dispatch, rootGetters }, { groupId, storeId, pickupId, userId, messageId, routeTo }) {
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
          dispatch('users/selectUser', { userId }, { root: true })
        }
        else {
          throw createRouteRedirect({ name: 'user', params: { userId }, query: routeTo.query })
        }
      }
      else if (messageId) {
        dispatch('selectThread', messageId)
        if (!Platform.is.mobile) {
          throw createRouteRedirect({ name: 'wall', params: { groupId }, query: routeTo.query })
        }
      }
    },
    async applicationRouteEnter ({ dispatch, rootGetters }, { groupId, applicationId, routeTo }) {
      if (!applicationId) return
      const selectPromise = dispatch('selectApplication', applicationId)
      if (!Platform.is.mobile) {
        await selectPromise
        const { isCurrentUser } = rootGetters['groupApplications/get'](applicationId).user
        // On desktop we don't have a detail page, we go to the application list or the group preview, and have a sidebar open
        throw createRouteRedirect({
          ...(isCurrentUser
            ? { name: 'groupPreview', params: { groupPreviewId: groupId } }
            : { name: 'groupApplications', params: { groupId } }
          ),
          query: routeTo.query,
        })
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
    openForApplication ({ dispatch }, application) {
      if (Platform.is.mobile) {
        router.push({ name: 'applicationDetail', params: { groupId: application.group.id, applicationId: application.id } })
      }
      else {
        dispatch('selectApplication', application.id)
      }
    },
    openForThread ({ dispatch }, message) {
      if (Platform.is.mobile) {
        router.push({ name: 'messageReplies', params: { messageId: message.id } })
      }
      else {
        dispatch('selectThread', message.id)
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
    async selectApplication ({ commit, dispatch }, applicationId) {
      dispatch('clear')
      commit('setApplicationId', applicationId)
      dispatch('conversations/fetchForApplication', { applicationId }, { root: true })
      await dispatch('groupApplications/maybeFetchOne', applicationId, { root: true })
    },
    selectThread ({ commit, dispatch }, id) {
      dispatch('clear')
      commit('setThreadId', id)
      dispatch('currentThread/fetchOrRedirect', id, { root: true })
    },
    clear ({ dispatch, state, commit }) {
      const { type, id } = state.scope
      if (type === 'pickup') {
        dispatch('conversations/clearForPickup', { pickupId: id }, { root: true })
      }
      else if (type === 'user') {
        dispatch('conversations/clearForUser', { userId: id }, { root: true })
      }
      else if (type === 'application') {
        dispatch('conversations/clearForApplication', { applicationId: id }, { root: true })
      }
      else if (type === 'thread') {
        dispatch('currentThread/clear', null, { root: true })
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
    setApplicationId (state, applicationId) {
      state.scope = { type: 'application', id: applicationId }
    },
    setThreadId (state, id) {
      state.scope = { type: 'thread', id }
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

export const plugin = store => {
  store.watch(state => state.route, route => {
    if (route.name === 'groupsGallery') {
      store.dispatch('detail/clear')
    }
  })
}
