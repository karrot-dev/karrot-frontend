import Vue from 'vue'
import pickups from '@/services/api/pickups'
import log from '@/services/log'

export const types = {

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
  RECEIVE_LEAVE_ERROR: 'Receive Leave Error'

}

export const state = {
  entries: []
}

export const getters = {
  isCollector: state => (pickupId, userId) => {
    let pickup = state.entries.find(pickup => pickup.id === pickupId)
    if (pickup && pickup.collectorIds.indexOf(userId) !== -1) {
      return true
    }
    return false
  }
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
      commit(types.RECEIVE_LIST, { pickups: await pickups.listByGroupId(groupId) })
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
  }

}

export const mutations = {
  [types.REQUEST_ITEM] (state) {},
  [types.RECEIVE_ITEM] (state, { pickup }) {
    log.debug('receive pickup!', pickup)
    let idx = state.entries.findIndex(g => g.id === pickup.id)
    if (idx !== -1) {
      Vue.set(state.entries, idx, { ...state.entries[idx], ...pickup })
    }
  },
  [types.RECEIVE_PICKUP_ERROR] (state, { error }) {},

  [types.REQUEST_LIST] (state) {},
  [types.RECEIVE_LIST] (state, { pickups }) {
    state.entries = pickups
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
  [types.RECEIVE_LEAVE_ERROR] (state, { error }) {}
}
