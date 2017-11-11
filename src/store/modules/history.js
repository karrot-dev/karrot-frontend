import Vue from 'vue'
import historyAPI from '@/services/api/history'
import { indexById } from '@/store/helpers'
import i18n from '@/i18n'

export const types = {
  REQUEST: 'Request',
  RECEIVE: 'Receive',
  RECEIVE_ERROR: 'Receive Error',

  SET_ACTIVE: 'Set Active',

  CLEAR: 'Clear',
}

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

export const state = initialState()

export const getters = {
  get: (state, getters, rootState, rootGetters) => id => getters.enrich(state.entries[id]),
  all: (state, getters, rootState, rootGetters) => state.idList.map(getters.get),
  receiveStatus: (state, getters, rootState, rootGetters) => state.receiveStatus,
  canLoadMore: (state, getters, rootState, rootGetters) => typeof state.cursor === 'string',
  enrich: (state, getters, rootState, rootGetters) => entry => {
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
  },
  active: (state, getters, rootState, rootGetters) => getters.get(state.activeId),
}

export const actions = {
  async setActive ({ commit, dispatch, state }, id) {
    if (!state.entries.id) {
      await dispatch('fetchById', id)
    }
    commit(types.SET_ACTIVE, { id })
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

  async fetchFiltered ({ dispatch, commit }, filters) {
    dispatch('clear')
    commit(types.REQUEST)
    let data
    try {
      data = await historyAPI.list(filters)
    }
    catch (error) {
      commit(types.RECEIVE_ERROR, { error })
      throw error
    }
    commit(types.RECEIVE, { entries: data.results, cursor: data.next })
  },
  async fetchById ({ commit, state }, id) {
    commit(types.RECEIVE, { entries: [await historyAPI.get(id)], cursor: state.cursor })
  },

  async fetchMore ({ state, commit }) {
    if (!state.cursor) {
      return
    }
    commit(types.REQUEST)

    try {
      const data = await historyAPI.listMore(state.cursor)
      commit(types.RECEIVE, { entries: data.results, cursor: data.next })
    }
    catch (error) {
      commit(types.RECEIVE_ERROR, { error })
    }
  },

  clear ({ commit }) {
    commit(types.CLEAR)
  },
}

export const mutations = {
  [types.SET_ACTIVE] (state, { id }) {
    state.activeId = id
  },
  [types.REQUEST] (state) {
    state.receiveStatus = {
      isWaiting: true,
      error: null,
      success: false,
    }
  },
  [types.RECEIVE] (state, { entries, cursor }) {
    state.receiveStatus = {
      isWaiting: false,
      error: null,
      success: true,
    }
    state.entries = {
      ...state.entries,
      ...indexById(entries),
    }
    state.idList.push(...entries.map(e => e.id)) // TODO take care of duplicates
    state.cursor = cursor
  },
  [types.RECEIVE_ERROR] (state, { error }) {
    state.receiveStatus = {
      isWaiting: false,
      error,
      success: false,
    }
  },

  [types.CLEAR] (state) {
    Object.entries(initialState())
      .forEach(([prop, value]) => Vue.set(state, prop, value))
  },
}
