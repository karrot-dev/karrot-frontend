import Vue from 'vue'
import historyAPI from '@/history/api/history'
import { indexById, createRouteError, createMetaModule, createPaginationModule, withMeta, metaStatuses } from '@/utils/datafoo/helpers'
import i18n from '@/base/i18n'
import deepEqual from 'deep-equal'

function initialState () {
  return {
    activeId: null,
    entries: {},
    idList: [], // sorted, most recent on top
    idListScope: {}, // what kind of data currently is loaded in idList
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
        if (entry.typus === 'GROUP_APPLICATION_DECLINED') {
          msgValues.applicantName = entry.payload.applicantName
        }
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
    ...metaStatuses(['fetchFiltered', 'fetchPast']),
  },
  actions: {
    ...withMeta({
      async fetchFiltered ({ state, dispatch, commit }, { filters }) {
        // only clear if scope changed
        if (!deepEqual(filters, state.idListScope)) {
          dispatch('clear')
          commit('setScope', filters)
        }
        const entries = await dispatch('pagination/extractCursor', historyAPI.list(filters))
        // check for race condition when switching pages
        if (!deepEqual(filters, state.idListScope)) return
        commit('update', { entries })
      },
      async fetchById ({ commit }, id) {
        // add entry by ID, not add to list
        const entry = await historyAPI.get(id)
        commit('addEntry', entry)
      },
      async fetchPast ({ state, commit, dispatch }) {
        const scope = state.idListScope
        const entries = await dispatch('pagination/fetchNext', historyAPI.listMore)
        // check for race condition when switching pages
        if (!deepEqual(scope, state.idListScope)) return
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
      })
    },
    async fetchForUserInGroup ({ dispatch }, { userId, groupId }) {
      dispatch('fetchFiltered', {
        filters: { users: userId, group: groupId },
      })
    },
    async fetchForStore ({ dispatch }, { storeId }) {
      dispatch('fetchFiltered', {
        filters: { store: storeId },
      })
    },

    update ({ state, commit }, entry) {
      // add entry if it fits current scope
      const { group, store, users } = state.idListScope
      const fitsGroupScope = () => group && entry.group === group
      const fitsStoreScope = () => store && entry.store === store
      const fitsUserInGroupScope = () => users && entry.users && entry.users.includes(users) && fitsGroupScope()
      if (fitsUserInGroupScope() || (fitsGroupScope() && !users) || fitsStoreScope()) {
        commit('update', { entries: [entry] })
      }
    },

    clear ({ commit }) {
      commit('clear')
    },

    refresh ({ state, dispatch }) {
      const { group, store, users } = state.idListScope
      if (group && users) return dispatch('fetchForUserInGroup', { userId: users, groupId: group })
      if (group) return dispatch('fetchForGroup', { groupId: group })
      if (store) return dispatch('fetchForStore', { storeId: store })
    },
  },
  mutations: {
    setActive (state, { id }) {
      state.activeId = id
    },
    setScope (state, scope) {
      state.idListScope = scope
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
