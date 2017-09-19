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

export const state = {
  entries: {},
  idList: [],
  idListGroupId: null,
  storeIdFilter: null,
}

export const getters = {
  all: state => state.idList.map(id => state.entries[id]),
  filtered: (state, getters) => getters.all.filter(e => !state.storeIdFilter || e.store === state.storeIdFilter),
  empty: (state, getters) => {
    return getters.all.filter((e) => {
      let nextWeek = new Date(+new Date() + 6096e5)
      return e.collectorIds.length < 1 && new Date(e.date) < nextWeek
    })
  },
  isCollector: (state, getters) => (pickupId, userId) => {
    let pickup = getters.all.find(pickup => pickup.id === pickupId)
    if (pickup && pickup.collectorIds.includes(userId)) {
      return true
    }
    return false
  },
  mine: (state, getters, rootState, rootGetters) => {
    if (!rootGetters['auth/isLoggedIn']) return []
    return getters.all.filter(e => e.collectorIds.includes(rootGetters['auth/userId']))
  },
}

export const actions = {

  async fetch ({ commit }, { pickupId }) {
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

  async fetchListByGroupId ({ commit }, { groupId }) {
    commit(types.REQUEST_LIST)
    try {
      commit(types.RECEIVE_LIST, { pickups: await pickups.listByGroupId(groupId), groupId })
    }
    catch (error) {
      commit(types.RECEIVE_LIST_ERROR, { error })
    }
  },

  async join ({ commit, dispatch }, { pickupId }) {
    commit(types.REQUEST_JOIN)
    try {
      await pickups.join(pickupId)
      commit(types.RECEIVE_JOIN)
      await dispatch('fetch', { pickupId })
    }
    catch (error) {
      commit(types.RECEIVE_JOIN_ERROR, { error })
    }
  },

  async leave ({ commit, dispatch }, { pickupId }) {
    commit(types.REQUEST_LEAVE)
    try {
      await pickups.leave(pickupId)
      commit(types.RECEIVE_LEAVE)
      await dispatch('fetch', { pickupId })
    }
    catch (error) {
      commit(types.RECEIVE_LEAVE_ERROR, { error })
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
    state.entries = {}
    state.idList = []
    state.idListGroupId = null
  },
  [types.REQUEST_ITEM] (state) {},
  [types.RECEIVE_ITEM] (state, { pickup }) {
    Vue.set(state.entries, pickup.id, pickup)
  },
  [types.RECEIVE_PICKUP_ERROR] (state, { error }) {},

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

  [types.REQUEST_JOIN] (state) {},
  [types.RECEIVE_JOIN] (state) {},
  [types.RECEIVE_JOIN_ERROR] (state, { error }) {},

  [types.REQUEST_LEAVE] (state) {},
  [types.RECEIVE_LEAVE] (state) {},
  [types.RECEIVE_LEAVE_ERROR] (state, { error }) {},
}
