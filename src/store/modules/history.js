import Vue from 'vue'
import historyAPI from '@/services/api/history'
import { indexById, createRouteError, createMetaModule, withMeta } from '@/store/helpers'
import i18n from '@/i18n'

function initialState () {
  return {
    activeId: null,
    entries: {},
    idList: [],
    cursor: null,
    receiveStatus: {
      isWaiting: false,
      error: null,
      success: true,
    },
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => id => getters.enrich(state.entries[id]),
    all: (state, getters, rootState, rootGetters) => state.idList.map(getters.get),
    // receiveStatus: (state, getters, rootState, rootGetters) => state.receiveStatus,
    canLoadMore: (state, getters, rootState, rootGetters) => typeof state.cursor === 'string',
    enrich: (state, getters, rootState, rootGetters) => entry => {
      if (entry) {
        const store = rootGetters['stores/get'](entry.store)
        const msgValues = store ? { storeName: store.name, name: store.name } : {}
        return {
          ...entry,
          users: entry.users.map(rootGetters['users/get']),
          group: rootGetters['groups/get'](entry.group),
          store: store,
          message: i18n.t(`HISTORY.${entry.typus}`, msgValues),
          // TODO enrich payload
        }
      }
    },
    active: (state, getters, rootState, rootGetters) => getters.get(state.activeId),
  },
  actions: {
    ...withMeta({
      async fetchFiltered ({ dispatch, commit }, filters) {
        dispatch('clear')
        const data = await historyAPI.list(filters)
        commit('update', { entries: data.results, cursor: data.next })
      },
      async fetchById ({ commit, state }, id) {
        // add entry by ID, keep cursor the same as before
        const entry = await historyAPI.get(id)
        commit('update', { entries: [entry], cursor: state.cursor })
      },

      async fetchMore ({ state, commit }) {
        if (!state.cursor) return
        const data = await historyAPI.listMore(state.cursor)
        commit('update', { entries: data.results, cursor: data.next })
      },

    }),

    async setActive ({ commit, dispatch, state }, { historyId }) {
      if (!state.entries[historyId]) {
        await dispatch('fetchById', historyId)
        if (!state.entries[historyId]) {
          throw createRouteError()
        }
      }
      commit('setActive', { id: historyId })
    },
    clearActive ({ commit }) {
      commit('setActive', { id: null })
    },
    async fetchForGroup ({ dispatch, rootGetters }, group) {
      dispatch('fetchFiltered', { group: group.id })
    },
    async fetchForUser ({ dispatch, rootGetters }, user) {
      dispatch('fetchFiltered', { users: user.id })
    },
    async fetchForStore ({ dispatch, rootGetters }, store) {
      dispatch('fetchFiltered', { store: store.id })
    },

    clear ({ commit }) {
      commit('clear')
    },
  },
  mutations: {
    setActive (state, { id }) {
      state.activeId = id
    },
    update (state, { entries, cursor }) {
      state.entries = {
        ...state.entries,
        ...indexById(entries),
      }
      // TODO sort list
      const ids = entries.map(e => e.id).filter(e => !state.idList.includes(e))
      state.idList.push(...ids)
      state.cursor = cursor
    },
    clear (state) {
      Object.entries(initialState())
        .forEach(([prop, value]) => Vue.set(state, prop, value))
    },
  },
}
