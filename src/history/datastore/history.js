import historyAPI from '@/history/api/history'
import { indexById, createRouteError, createMetaModule, createPaginationModule, withMeta, metaStatuses } from '@/utils/datastore/helpers'
import { filterTruthy } from '@/utils/utils'
import i18n from '@/base/i18n'

function initialState () {
  return {
    activeId: null,
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
    all: (state, getters, rootState, rootGetters) => Object.values(state.entries).map(getters.enrich).sort(sortById),
    byCurrentGroup: (state, getters) => {
      return getters.all.filter(({ group }) => group && group.isCurrentGroup)
    },
    byActiveStore: (state, getters) => {
      return getters.all.filter(({ store }) => store && store.isActiveStore)
    },
    byCurrentGroupAndUser: (state, getters, rootState, rootGetters) => {
      // TODO could enrich user with isActiveUser property instead
      const activeUserId = rootGetters['users/activeUserId']
      if (!activeUserId) return []
      return getters.byCurrentGroup.filter(({ users }) => users.find(u => u.id === activeUserId))
    },
    canFetchPast: (state, getters) => getters['pagination/canFetchNext'],
    enrich: (state, getters, rootState, rootGetters) => entry => {
      if (!entry) return
      const store = rootGetters['stores/get'](entry.store)
      const msgValues = store ? { storeName: store.name, name: store.name } : {}
      if (entry.typus === 'GROUP_APPLICATION_DECLINED') {
        msgValues.applicantName = entry.payload.applicantName
      }
      return {
        ...entry,
        users: entry.users && entry.users.map(rootGetters['users/get']),
        group: rootGetters['groups/get'](entry.group),
        store,
        message: i18n.t(`HISTORY.${entry.typus}`, msgValues),
        // TODO enrich payload
      }
    },
    active: (state, getters, rootState, rootGetters) => getters.get(state.activeId),
    ...metaStatuses(['fetch', 'fetchPast']),
  },
  actions: {
    ...withMeta({
      async fetch ({ dispatch, commit }, { groupId, storeId, userId }) {
        const filters = filterTruthy({
          store: storeId,
          group: groupId,
          users: userId,
        })
        const entries = await dispatch('pagination/extractCursor', historyAPI.list(filters))
        commit('update', entries)
      },
      async fetchById ({ commit }, id) {
        const entry = await historyAPI.get(id)
        commit('update', [entry])
      },
      async fetchPast ({ commit, dispatch }) {
        const entries = await dispatch('pagination/fetchNext', historyAPI.listMore)
        commit('update', entries)
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
  },
  mutations: {
    setActive (state, { id }) {
      state.activeId = id
    },
    update (state, entries) {
      state.entries = {
        ...state.entries,
        ...indexById(entries),
      }
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}

export function sortById (a, b) {
  return b.id - a.id
}
