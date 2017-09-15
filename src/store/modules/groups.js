import Vue from 'vue'
import groups from '@/services/api/groups'
import log from '@/services/log'

export const types = {

  REQUEST_GROUP: 'Request Group',
  RECEIVE_GROUP: 'Receive Group',
  RECEIVE_GROUP_ERROR: 'Receive Group Error',

  REQUEST_GROUPS: 'Request Groups',
  RECEIVE_GROUPS: 'Receive Groups',
  RECEIVE_GROUPS_ERROR: 'Receive Groups Error',

  REQUEST_JOIN: 'Request Join',
  RECEIVE_JOIN: 'Receive Join',
  RECEIVE_JOIN_ERROR: 'Receive Join Error',

  REQUEST_LEAVE: 'Request Leave',
  RECEIVE_LEAVE: 'Receive Leave',
  RECEIVE_LEAVE_ERROR: 'Receive Leave Error'

}

export const state = {
  entries: [],
  isFetching: false,
  error: null
}

export const getters = {
  isMember: state => (groupId, userId) => {
    let group = state.entries.find(group => group.id === groupId)
    if (group && group.members.indexOf(userId) !== -1) {
      return true
    }
    return false
  }
}

export const actions = {

  async fetchGroup ({ commit }, { groupId }) {
    commit(types.REQUEST_GROUP)
    try {
      commit(types.RECEIVE_GROUP, { group: await groups.get(groupId) })
    }
    catch (error) {
      commit(types.RECEIVE_GROUP_ERROR, { error })
    }
  },

  async fetchGroups ({ commit }) {
    commit(types.REQUEST_GROUPS)
    try {
      commit(types.RECEIVE_GROUPS, { groups: await groups.list() })
    }
    catch (error) {
      commit(types.RECEIVE_GROUPS_ERROR, { error })
    }
  },

  async join ({ commit, dispatch }, { groupId, password }) {
    commit(types.REQUEST_JOIN)
    try {
      await groups.join(groupId, { password })
      commit(types.RECEIVE_JOIN)
      await dispatch('fetchGroup', { groupId })
    }
    catch (error) {
      commit(types.RECEIVE_JOIN_ERROR, { error })
    }
  },

  async leave ({ commit, dispatch }, { groupId }) {
    commit(types.REQUEST_LEAVE)
    try {
      await groups.leave(groupId)
      commit(types.RECEIVE_LEAVE)
      await dispatch('fetchGroup', { groupId })
    }
    catch (error) {
      commit(types.RECEIVE_LEAVE_ERROR, { error })
    }
  }

}

export const mutations = {
  [types.REQUEST_GROUP] (state) {},
  [types.RECEIVE_GROUP] (state, { group }) {
    log.debug('receive group!', group)
    let idx = state.entries.findIndex(g => g.id === group.id)
    if (idx !== -1) {
      Vue.set(state.entries, idx, { ...state.entries[idx], ...group })
    }
  },
  [types.RECEIVE_GROUP_ERROR] (state, { error }) {},

  [types.REQUEST_GROUPS] (state) {
    state.isFetching = true
  },
  [types.RECEIVE_GROUPS] (state, { groups }) {
    state.isFetching = false
    state.entries = groups
  },
  [types.RECEIVE_GROUPS_ERROR] (state, { error }) {
    state.isFetching = false
    state.error = error.message
  },

  [types.REQUEST_JOIN] (state) {},
  [types.RECEIVE_JOIN] (state) {},
  [types.RECEIVE_JOIN_ERROR] (state, { error }) {},

  [types.REQUEST_LEAVE] (state) {},
  [types.RECEIVE_LEAVE] (state) {},
  [types.RECEIVE_LEAVE_ERROR] (state, { error }) {}
}
