import Vue from 'vue'
import { createMetaModule, createPaginationModule, withMeta } from '@/store/helpers'
import notificationsAPI from '@/services/api/notifications'

function initialState () {
  return {
    now: new Date(), // reactive current time
    meta: {
      markedAt: null,
    },
    entries: {},
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
      return {
        ...entry,
        group: entry.context.group && rootGetters['groups/get'](entry.context.group),
        application: entry.context.application && rootGetters['groupApplications/get'](entry.context.application),
      }
    },
    unseenCount: (state, getters) => {
      return getters.current.filter(notification => !state.meta.markedAt || notification.createdAt > state.meta.markedAt).length
    },
  },
  actions: {
    ...withMeta({
      async fetch ({ commit, dispatch }) {
        const { notifications, markedAt } = await dispatch('pagination/extractCursor', notificationsAPI.list())
        commit('update', notifications)
        commit('setMarkedAt', markedAt)
      },
      async fetchPast ({ commit, dispatch }) {
        const { notifications, markedAt } = await dispatch('pagination/fetchNext', notificationsAPI.listMore)
        commit('update', notifications)
        commit('setMarkedAt', markedAt)
      },
      async markClicked ({ commit }, notification) {
        notificationsAPI.markClicked(notification.id)
      },
      async markSeen () {
        notificationsAPI.markSeen()
      },
    }),
    update ({ commit }, entry) {
      commit('update', [entry])
    },
    delete ({ commit }, id) {
      commit('delete', id)
    },
    clear ({ commit }) {
      commit('clear')
    },
    refresh ({ commit }) {
      commit('clear')
      commit('fetch')
    },
  },
  mutations: {
    updateNow (state) {
      state.now = new Date()
    },
    setMeta (state, data) {
      state.meta = data
    },
    update (state, entries) {
      for (const entry of entries) {
        Vue.set(state.entries, entry.id, entry)
      }
    },
    delete (state, id) {
      // TODO what if id is not in entries?
      Vue.delete(state.entries, id)
    },
    clear (state) {
      Object.entries(initialState())
        .forEach(([prop, value]) => Vue.set(state, prop, value))
    },
  },
}

export function plugin (store) {
  // keep state.now update to date
  setInterval(() => store.commit('notifications/updateNow'), 60 * 1000)

  // load notifications when logged in
  store.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (isLoggedIn) {
      store.dispatch('notifications/fetch')
    }
    else {
      store.dispatch('notifications/clear')
    }
  })
}

export function sortByCreatedAt (a, b) {
  return b.createdAt - a.createdAt
}
