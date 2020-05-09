import deepmerge from 'deepmerge'

import api from '@/status/api/status'

function initialState () {
  return {
    unseenConversationCount: 0,
    unseenThreadCount: 0,
    hasUnreadConversationsOrThreads: false,
    unseenNotificationCount: 0,
    /*
      {
        <id> : {
          pendingApplicationCount: 0,
          feedbackPossibleCount: 0,
          unreadWallMessageCount: 0
        }
      }
    */
    groups: {},
    /*
      {
        <id> {
          unreadWallMessageCount: 0
        }
      }
    */
    places: {},
  }
}

export default {
  namespaced: true,
  state: initialState,
  getters: {
    // Global
    unseenConversationCount: state => state.unseenConversationCount,
    unseenThreadCount: state => state.unseenThreadCount,
    hasUnreadConversationsOrThreads: state => state.hasUnreadConversationsOrThreads,
    unseenCount: (state, getters) => getters.unseenConversationCount + getters.unseenThreadCount,
    unseenNotificationCount: state => state.unseenNotificationCount,

    // Group related
    groupId: (state, getters, rootState, rootGetters) => rootGetters['currentGroup/id'],
    currentGroupWallUnreadCount: (state, getters) => {
      const { unreadWallMessageCount = 0 } = state.groups[getters.groupId] || {}
      return unreadWallMessageCount
    },
    currentGroupFeedbackPossibleCount: (state, getters) => {
      const { feedbackPossibleCount = 0 } = state.groups[getters.groupId] || {}
      return feedbackPossibleCount
    },
    currentGroupPendingApplicationCount: (state, getters, rootState, rootGetters) => {
      const { pendingApplicationCount = 0 } = state.groups[getters.groupId] || {}
      return pendingApplicationCount
    },

    // Place related
    placeId: (state, getters, rootState, rootGetters) => rootGetters['places/activePlaceId'],
    getPlaceWallUnreadCount: state => placeId => {
      const { unreadWallMessageCount = 0 } = state.places[placeId] || {}
      return unreadWallMessageCount
    },
    activePlaceWallUnreadCount: (state, getters) => {
      return getters.getPlaceWallUnreadCount(getters.placeId)
    },
  },
  actions: {
    async fetch ({ commit }) {
      commit('update', await api.fetch())
    },
    clear ({ commit }) {
      commit('clear')
    },
    refresh ({ dispatch }) {
      dispatch('fetch')
    },
  },
  mutations: {
    update (state, status) {
      Object.assign(state, deepmerge(state, status))
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

export function plugin (datastore) {
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (isLoggedIn) {
      datastore.dispatch('status/fetch')
    }
    else {
      datastore.dispatch('status/clear')
    }
  })
}
