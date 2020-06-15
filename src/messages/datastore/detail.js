import { Platform } from 'quasar'

import { createRouteRedirect } from '@/utils/datastore/helpers'
import router from '@/base/router'

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
    activity: (state, getters, rootState, rootGetters) => {
      const { type, id } = state.scope
      if (type !== 'pickup') return
      return rootGetters['activities/get'](id)
    },
    user: (state, getters, rootState, rootGetters) => {
      const { type, id } = state.scope
      if (type !== 'user') return
      return rootGetters['users/get'](id)
    },
    application: (state, getters, rootState, rootGetters) => {
      const { type, id } = state.scope
      if (type !== 'application') return
      return rootGetters['applications/get'](id)
    },
    conversation: (state, getters, rootState, rootGetters) => {
      const { type, id } = state.scope
      if (type === 'pickup') {
        return rootGetters['conversations/getForActivity'](id)
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
    routeEnter ({ dispatch, rootGetters }, { groupId, placeId, activityId, userId, messageId, routeTo }) {
      if (activityId) {
        dispatch('selectActivity', activityId)
        if (!Platform.is.mobile) {
          // On desktop we don't have a activity detail page, we go to the place page, and have a sidebar open
          throw createRouteRedirect({ name: 'place', params: { groupId, placeId }, query: routeTo.query })
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
          throw createRouteRedirect({ name: 'group', params: { groupId }, query: routeTo.query })
        }
      }
    },
    async applicationRouteEnter ({ dispatch, rootGetters }, { groupId, applicationId, routeTo }) {
      if (!applicationId) return
      await dispatch('selectApplication', applicationId)
      const { isCurrentUser } = rootGetters['applications/get'](applicationId).user
      if (!Platform.is.mobile) {
        // On desktop we don't have a detail page, we go to the application list or the group preview, and have a sidebar open
        throw createRouteRedirect({
          ...(isCurrentUser
            ? { name: 'groupPreview', params: { groupPreviewId: groupId } }
            : { name: 'applications', params: { groupId } }
          ),
          query: routeTo.query,
        })
      }
      if (!isCurrentUser) dispatch('currentGroup/select', { groupId }, { root: true })
    },
    routeLeave ({ dispatch }) {
      if (Platform.is.mobile) {
        dispatch('clear')
      }
    },
    openForActivity ({ dispatch }, activity) {
      if (Platform.is.mobile) {
        const { id, group, place } = activity
        router.push({ name: 'activityDetail', params: { groupId: group.id, placeId: place.id, activityId: id } }).catch(() => {})
      }
      else {
        dispatch('selectActivity', activity.id)
      }
    },
    openForUser ({ dispatch }, user) {
      if (Platform.is.mobile) {
        router.push({ name: 'userDetail', params: { userId: user.id } }).catch(() => {})
      }
      else {
        dispatch('selectUser', user.id)
      }
    },
    openForApplication ({ dispatch }, application) {
      if (Platform.is.mobile) {
        const { id, group } = application
        router.push({ name: 'applicationDetail', params: { groupId: group.id, applicationId: id } }).catch(() => {})
      }
      else {
        dispatch('selectApplication', application.id)
      }
    },
    openForThread ({ dispatch }, message) {
      if (Platform.is.mobile) {
        const { id, groupId } = message
        router.push({ name: 'messageReplies', params: { groupId, messageId: id } }).catch(() => {})
      }
      else {
        dispatch('selectThread', message.id)
      }
    },
    async selectActivity ({ commit, dispatch }, activityId) {
      dispatch('clear')
      commit('setActivityId', activityId)
      dispatch('conversations/fetchForActivity', { activityId }, { root: true })
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
      await dispatch('applications/maybeFetchOne', applicationId, { root: true })
    },
    selectThread ({ commit, dispatch }, id) {
      console.log('selectThread', id)
      dispatch('clear')
      commit('setThreadId', id)
      dispatch('currentThread/fetchOrRedirect', id, { root: true })
    },
    clear ({ dispatch, state, commit }) {
      const { type, id } = state.scope
      if (type === 'pickup') {
        dispatch('conversations/clearForActivity', { activityId: id }, { root: true })
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
    setActivityId (state, activityId) {
      state.scope = { type: 'pickup', id: activityId }
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

export const plugin = datastore => {
  datastore.watch(state => state.route, route => {
    if (route.name === 'groupsGallery') {
      datastore.dispatch('detail/clear')
    }
  })
}
