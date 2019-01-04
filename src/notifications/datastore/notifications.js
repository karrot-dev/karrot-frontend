import Vue from 'vue'
import { createMetaModule, createPaginationModule, withMeta } from '@/utils/datastore/helpers'
import notificationsAPI from '@/notifications/api/notifications'

function initialState () {
  return {
    now: new Date(), // reactive current time
    entryMeta: {
      markedAt: null,
    },
    entries: {},
    pageVisible: false,
  }
}

export default {
  namespaced: true,
  modules: {
    meta: createMetaModule(),
    pagination: createPaginationModule(),
  },
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => id => getters.enrich(state.entries[id]),
    current: (state, getters, rootState, rootGetters) => {
      return Object.values(state.entries)
        .map(getters.enrich)
        .filter(notification => !notification.expiresAt || notification.expiresAt > state.now)
        .sort(sortByCreatedAt)
    },
    canFetchPast: (state, getters) => getters['pagination/canFetchNext'],
    fetchingPast: (state, getters) => getters['meta/status']('fetchPast').pending,
    enrich: (state, getters, rootState, rootGetters) => entry => {
      if (!entry) return
      const { markedAt } = state.entryMeta

      return {
        ...entry,
        context: getters.enrichContext(entry.context),
        isUnseen: !markedAt || entry.createdAt > markedAt,
      }
    },
    enrichContext: (state, getters, rootState, rootGetters) => context => {
      if (!context) return
      const { group, application, user, place, pickup } = context
      return {
        ...context,
        group: group && rootGetters['groups/get'](group),
        application: application && rootGetters['groupApplications/get'](application),
        user: user && rootGetters['users/get'](user),
        place: place && rootGetters['places/get'](place),
        pickup: pickup && rootGetters['pickups/get'](pickup),
      }
    },
    unseenCount: (state, getters) => {
      return getters.current.filter(notification => notification.isUnseen).length
    },
  },
  actions: {
    ...withMeta({
      async fetch ({ commit, dispatch }) {
        const { notifications, meta } = await dispatch('pagination/extractCursor', notificationsAPI.list())
        if (notifications) commit('update', notifications)
        if (meta) commit('setEntryMeta', meta)
      },
      async fetchPast ({ commit, dispatch }) {
        const { notifications, meta } = await dispatch('pagination/fetchNext', notificationsAPI.listMore)
        if (notifications) commit('update', notifications)
        if (meta) commit('setEntryMeta', meta)
      },
      async markClicked ({ dispatch, getters }, notification) {
        if (!notification.clicked) {
          notificationsAPI.markClicked(notification.id)
        }

        // make sure notifications are getting marked as seen, too
        if (!getters['meta/status']('markSeen').pending) {
          dispatch('markSeen')
        }
      },
      async markSeen ({ getters }) {
        // we can skip marking if there are only seen notifications
        if (!getters.unseenCount) return
        notificationsAPI.markSeen()
      },
    }),
    fetchRelated ({ state, dispatch }) {
      for (const notification of Object.values(state.entries)) {
        const { context } = notification
        if (!context) continue
        if (context.application) {
          dispatch('groupApplications/maybeFetchOne', context.application, { root: true })
        }
        if (context.pickup) {
          dispatch('pickups/maybeFetch', context.pickup, { root: true })
        }
      }
    },
  },
  mutations: {
    updateNow (state) {
      state.now = new Date()
    },
    setPageVisible (state, visible) {
      state.pageVisible = visible
    },
    setEntryMeta (state, data) {
      state.entryMeta = data
    },
    update (state, entries) {
      for (const entry of entries) {
        Vue.set(state.entries, entry.id, entry)
      }
    },
    delete (state, id) {
      Vue.delete(state.entries, id)
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

export function plugin (datastore) {
  // keep state.now update to date
  setInterval(() => datastore.commit('notifications/updateNow'), 60 * 1000)

  // load notifications when logged in
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (isLoggedIn) {
      datastore.dispatch('notifications/fetch')
    }
    else {
      datastore.commit('notifications/clear')
    }
  })

  // make sure related data stays loaded when page is visible
  datastore.watch((state) => ({
    pageVisible: state.notifications.pageVisible,
    entries: state.notifications.entries,
  }), ({ pageVisible }) => {
    if (pageVisible) {
      datastore.dispatch('notifications/fetchRelated')
    }
  })
}

export function sortByCreatedAt (a, b) {
  return b.createdAt - a.createdAt
}
