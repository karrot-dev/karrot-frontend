import deepmerge from 'deepmerge'

import api from '@/status/api/status'

function initialState () {
  return {
    unseenConversationCount: 0,
    unseenThreadCount: 0,
    hasUnreadConversationsOrThreads: false,
    unseenNotificationCount: 0,
    communityFeedMeta: '2020-01-21T11:38:49.932716Z',
    /*
      {
        <id> : {
          pendingApplicationCount: 0,
          upcomingPickupCount: {
            joined: 0,
            others: 0
          },
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
    hasUnreadMessagesOrThreads: state => state.hasUnreadMessagesOrThreads,
    unseenCount: (state, getters) => getters.unseenConversationCount + getters.unseenThreadCount,

    unseenNotificationCount: state => state.unseenNotificationCount,

    // Group related
    groupId: (state, getters, rootState, rootGetters) => rootGetters['currentGroup/id'],
    currentGroupWallUnreadCount: (state, getters) => {
      const { unreadWallMessageCount = 0 } = state.groups[getters.groupId] || {}
      return unreadWallMessageCount
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
      console.log('updating status state!', JSON.stringify(status, null, 2))
      Object.assign(state, deepmerge(state, status))
      console.log('status state is now', JSON.stringify(state, null, 2))
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
