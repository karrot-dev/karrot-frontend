import Vue from 'vue'
import historyAPI from '@/services/api/history'
import { indexById, createRouteError, createMetaModule, createPaginationModule, withMeta, metaStatuses } from '@/store/helpers'
import i18n from '@/i18n'

function initialState () {
  return {
    activeId: null,
    entries: {},
    idList: [], // sorted, most recent on top
    idListScope: { type: null, id: null }, // what kind of data currently is loaded in idList
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
    all: (state, getters, rootState, rootGetters) => state.idList.map(getters.get),
    canFetchPast: (state, getters) => getters['pagination/canFetchNext'],
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
      async fetchFiltered ({ state, dispatch, commit }, { filters, scope }) {
        // only clear if scope changed
        const {type, id} = state.idListScope
        if (scope.type !== type || scope.id !== id) {
          dispatch('clear')
          commit('setScope', scope)
        }
        const entries = await dispatch('pagination/extractCursor', historyAPI.list(filters))
        // check for race condition when switching pages
        if (scope.type !== state.idListScope.type || scope.id !== state.idListScope.id) return
        commit('update', { entries })
      },
      async fetchById ({ commit }, id) {
        // add entry by ID, not add to list
        const entry = await historyAPI.get(id)
        commit('addEntry', entry)
      },
      async fetchPast ({ state, commit, dispatch }) {
        const {type, id} = state.idListScope
        const entries = await dispatch('pagination/fetchNext', historyAPI.listMore)
        // check for race condition when switching pages
        if (type !== state.idListScope.type || id !== state.idListScope.id) return
        commit('update', { entries })
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

    async fetchForGroup ({ dispatch }, { groupId }) {
      dispatch('fetchFiltered', {
        filters: { group: groupId },
        scope: { type: 'group', id: groupId },
      })
    },
    async fetchForUser ({ dispatch }, { userId }) {
      dispatch('fetchFiltered', {
        filters: { users: userId },
        scope: { type: 'user', id: userId },
      })
    },
    async fetchForStore ({ dispatch }, { storeId }) {
      dispatch('fetchFiltered', {
        filters: { store: storeId },
        scope: { type: 'store', id: storeId },
      })
    },

    update ({ state, commit }, entry) {
      // add entry if it fits current scope
      const {type, id} = state.idListScope
      const fitsGroupScope = () => type === 'group' && entry.group === id
      const fitsStoreScope = () => type === 'store' && entry.store === id
      const fitsUserScope = () => type === 'user' && entry.users && entry.users.includes(id)
      if (fitsGroupScope() || fitsStoreScope() || fitsUserScope()) {
        commit('update', { entries: [entry] })
      }
    },

    clear ({ commit }) {
      commit('clear')
    },

    refresh ({ state, dispatch }) {
      const {type, id} = state.idListScope
      switch (type) {
        case 'group': return dispatch('fetchForGroup', { groupId: id })
        case 'user': return dispatch('fetchForUser', { userId: id })
        case 'store': return dispatch('fetchForStore', { storeId: id })
      }
    },
  },
  mutations: {
    setActive (state, { id }) {
      state.activeId = id
    },
    setScope (state, { type, id }) {
      state.idListScope.type = type
      state.idListScope.id = id
    },
    addEntry (state, entry) {
      // add entry without adding it to list
      // used for history detail view
      state.entries[entry.id] = entry
    },
    update (state, { entries }) {
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
    },
    clear (state) {
      Object.entries(initialState())
        .forEach(([prop, value]) => Vue.set(state, prop, value))
    },
  },
}
