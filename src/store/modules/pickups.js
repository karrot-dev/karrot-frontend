import Vue from 'vue'
import pickups from '@/services/api/pickups'

export const types = {

  SET_STORE_ID_FILTER: 'Set storeIdFilter',
  CLEAR_STORE_ID_FILTER: 'Clear storeIdFilter',

  REQUEST_LIST: 'Request List',
  RECEIVE_LIST: 'Receive List',
  RECEIVE_LIST_ERROR: 'Receive List Error',

  REQUEST_ITEM: 'Request Item',
  RECEIVE_ITEM: 'Receive Item',
  RECEIVE_ITEM_ERROR: 'Receive Item Error',

  REQUEST_JOIN: 'Request Join',
  RECEIVE_JOIN: 'Receive Join',
  RECEIVE_JOIN_ERROR: 'Receive Join Error',

  REQUEST_LEAVE: 'Request Leave',
  RECEIVE_LEAVE: 'Receive Leave',
  RECEIVE_LEAVE_ERROR: 'Receive Leave Error',

  CLEAR: 'Clear',

}

function initialState () {
  return {
    entries: {},
    waiting: {},
    idList: [],
    idListGroupId: null,
    storeIdFilter: null,
  }
}
export const state = initialState()

export const getters = {
  get: (state, getters, rootState, rootGetters) => pickupId => {
    return getters.enrich(state.entries[pickupId])
  },
  enrich: (state, getters, rootState, rootGetters) => pickup => {
    const userId = rootGetters['auth/userId']
    return pickup && {
      ...pickup,
      isWaiting: !!state.waiting[pickup.id],
      isUserMember: pickup.collectorIds.includes(userId),
      store: rootGetters['stores/get'](pickup.store),
      collectors: pickup.collectorIds.map(rootGetters['users/get']),
      __unenriched: pickup,
    }
  },
  all: (state, getters, rootState, rootGetters) => {
    return state.idList.map(getters.get)
  },
  filtered: (state, getters) => {
    return getters.all.filter(e => !state.storeIdFilter || (e.store && e.store.id === state.storeIdFilter))
  },
  filteredOneTime: (state, getters) => {
    return getters.filtered.filter(e => !e.series)
  },
  empty: (state, getters) => {
    return getters.all.filter((e) => {
      let nextWeek = new Date(+new Date() + 6096e5)
      return e.collectorIds.length < 1 && e.date < nextWeek
    })
  },
  mine: (state, getters, rootState, rootGetters) => {
    if (!rootGetters['auth/isLoggedIn']) return []
    return getters.all.filter(e => e.collectorIds.includes(rootGetters['auth/userId']))
  },
}

export const actions = {

  async fetch ({ commit }, pickupId) {
    commit(types.REQUEST_ITEM)
    try {
      commit(types.RECEIVE_ITEM, { pickup: await pickups.get(pickupId) })
    }
    catch (error) {
      commit(types.RECEIVE_ITEM_ERROR, { error })
    }
  },

  setStoreFilter ({ commit }, storeId) {
    commit(types.SET_STORE_ID_FILTER, { storeId })
  },

  clear ({ commit }) {
    commit(types.CLEAR)
  },

  clearStoreFilter ({ commit }) {
    commit(types.CLEAR_STORE_ID_FILTER)
  },

  async fetchList ({ commit }) {
    commit(types.REQUEST_LIST)
    try {
      commit(types.RECEIVE_LIST, { pickups: await pickups.list() })
    }
    catch (error) {
      commit(types.RECEIVE_LIST_ERROR, { error })
    }
  },

  async fetchListByGroupId ({ commit }, groupId) {
    commit(types.REQUEST_LIST)
    try {
      commit(types.RECEIVE_LIST, { pickups: await pickups.listByGroupId(groupId), groupId })
    }
    catch (error) {
      commit(types.RECEIVE_LIST_ERROR, { error })
    }
  },

  async join ({ commit, dispatch, rootGetters }, pickupId) {
    commit(types.REQUEST_JOIN, { pickupId })
    try {
      await pickups.join(pickupId)
      commit(types.RECEIVE_JOIN, { pickupId, userId: rootGetters['auth/userId'] })
    }
    catch (error) {
      commit(types.RECEIVE_JOIN_ERROR, { error, pickupId })
      dispatch('fetch', { pickupId })
    }
  },

  async leave ({ commit, dispatch, rootGetters }, pickupId) {
    commit(types.REQUEST_LEAVE, { pickupId })
    try {
      await pickups.leave(pickupId)
      commit(types.RECEIVE_LEAVE, { pickupId, userId: rootGetters['auth/userId'] })
    }
    catch (error) {
      commit(types.RECEIVE_LEAVE_ERROR, { error, pickupId })
      dispatch('fetch', { pickupId })
    }
  },

  async save ({ commit, dispatch }, pickup) {
    await pickups.save(pickup)
    dispatch('refresh')
  },

  refresh ({ state, dispatch }) {
    if (state.idListGroupId) {
      dispatch('fetchListByGroupId', state.idListGroupId)
    }
    else {
      dispatch('fetchList')
    }
  },

}

export const mutations = {
  [types.SET_STORE_ID_FILTER] (state, { storeId }) {
    state.storeIdFilter = parseInt(storeId)
  },

  [types.CLEAR_STORE_ID_FILTER] (state) {
    state.storeIdFilter = null
  },

  [types.CLEAR] (state) {
    Object.entries(initialState())
      .forEach(([prop, value]) => Vue.set(state, prop, value))
  },
  [types.REQUEST_ITEM] (state) {},
  [types.RECEIVE_ITEM] (state, { pickup }) {
    Vue.set(state.entries, pickup.id, pickup)
  },
  [types.RECEIVE_ITEM_ERROR] (state, { error }) {},

  [types.REQUEST_LIST] (state) {},
  [types.RECEIVE_LIST] (state, { pickups, groupId }) {
    let entries = {}
    let ids = []
    for (let pickup of pickups) {
      entries[pickup.id] = pickup
      ids.push(pickup.id)
    }
    state.entries = entries
    state.idList = ids
    state.idListGroupId = groupId
    state.error = null
  },
  [types.RECEIVE_LIST_ERROR] (state, { error }) {
    state.error = error.message
  },

  [types.REQUEST_JOIN] (state, { pickupId }) {
    Vue.set(state.waiting, pickupId, true)
  },
  [types.RECEIVE_JOIN] (state, { pickupId, userId }) {
    Vue.delete(state.waiting, pickupId)
    state.entries[pickupId].collectorIds.push(userId)
  },
  [types.RECEIVE_JOIN_ERROR] (state, { error, pickupId }) {
    Vue.delete(state.waiting, pickupId)
  },

  [types.REQUEST_LEAVE] (state, { pickupId }) {
    Vue.set(state.waiting, pickupId, true)
  },
  [types.RECEIVE_LEAVE] (state, { pickupId, userId }) {
    Vue.delete(state.waiting, pickupId)
    let { collectorIds } = state.entries[pickupId]
    let idx = collectorIds.indexOf(userId)
    if (idx !== -1) collectorIds.splice(idx, 1)
  },
  [types.RECEIVE_LEAVE_ERROR] (state, { error, pickupId }) {
    Vue.delete(state.waiting, pickupId)
  },
}
