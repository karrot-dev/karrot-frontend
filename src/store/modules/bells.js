import Vue from 'vue'
import { createMetaModule, createPaginationModule, withMeta } from '@/store/helpers'
import bellsAPI from '@/services/api/bells'

function initialState () {
  return {
    now: new Date(), // reactive current time
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
        .filter(bell => !bell.expiresAt || bell.expiresAt > state.now)
        .sort(sortByCreatedAt)
    },
    canFetchPast: (state, getters) => getters['pagination/canFetchNext'],
    fetchingPast: (state, getters) => getters['meta/status']('fetchPast').pending,
    enrich: (state, getters, rootState, rootGetters) => entry => {
      if (!entry) return
      return {
        ...entry,
        group: entry.payload.group && rootGetters['groups/get'](entry.payload.group),
        application: entry.payload.application && rootGetters['groupApplications/get'](entry.payload.application),
      }
    },
    unreadCount: (state, getters) => getters.current.length,
  },
  actions: {
    ...withMeta({
      async fetch ({ dispatch, commit }) {
        const entries = await dispatch('pagination/extractCursor', bellsAPI.list())
        commit('update', entries)
      },
      async fetchPast ({ state, commit, dispatch }) {
        const entries = await dispatch('pagination/fetchNext', bellsAPI.listMore)
        commit('update', entries)
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
  setInterval(() => store.commit('bells/updateNow'), 60 * 1000)

  // load bells when logged in
  store.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (isLoggedIn) {
      store.dispatch('bells/fetch')
    }
    else {
      store.dispatch('bells/clear')
    }
  })
}

export function sortByCreatedAt (a, b) {
  return b.createdAt - a.createdAt
}
