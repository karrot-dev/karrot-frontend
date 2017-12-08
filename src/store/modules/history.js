import Vue from 'vue'
import historyAPI from '@/services/api/history'
import { indexById, createRouteError, createMetaModule, withMeta, metaStatuses } from '@/store/helpers'
import i18n from '@/i18n'

function initialState () {
  return {
    activeId: null,
    entries: {},
    idList: [], // sorted, most recent on top
    cursor: null,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => id => getters.enrich(state.entries[id]),
    all: (state, getters, rootState, rootGetters) => state.idList.map(getters.get),
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
    ...metaStatuses(['fetchFiltered']),
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
    async fetchForGroup ({ dispatch, rootGetters }, { groupId }) {
      dispatch('fetchFiltered', { group: groupId })
    },
    async fetchForUser ({ dispatch, rootGetters }, { userId }) {
      dispatch('fetchFiltered', { users: userId })
    },
    async fetchForStore ({ dispatch, rootGetters }, { storeId }) {
      dispatch('fetchFiltered', { store: storeId })
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
      // simple insertion sort for new entries
      // assumes that state.entries are sorted AND incoming entries are sorted
      const newIds = entries.map(e => e.id).filter(e => !state.idList.includes(e))
      let i = 0
      for (let id of newIds) {
        const date = state.entries[id].date
        while (i < state.idList.length && state.entries[state.idList[i]].date > date) i++
        state.idList.splice(i, 0, id)
      }
      state.cursor = cursor
    },
    clear (state) {
      Object.entries(initialState())
        .forEach(([prop, value]) => Vue.set(state, prop, value))
    },
  },
}
