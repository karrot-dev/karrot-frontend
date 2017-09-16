import Vue from 'vue'
import groups from '@/services/api/groups'
import { types as conversationTypes } from './conversations'
import { indexById } from '@/store/helpers'

export const types = {

  SELECT_GROUP: 'Select Group',

  REQUEST_GROUP: 'Request Group',
  RECEIVE_GROUP: 'Receive Group',
  RECEIVE_GROUP_ERROR: 'Receive Group Error',

  REQUEST_CONVERSATION: 'Request Group Conversation',
  RECEIVE_CONVERSATION: 'Receive Group Conversation',
  RECEIVE_CONVERSATION_ERROR: 'Receive Group Conversation Error',

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
  entries: {},
  selected: {},
  isFetching: false,
  error: null
}

export const getters = {
  list: state => Object.values(state.entries),
  isFetching: state => state.isFetching,
  error: state => state.error,
  isMember: state => (groupId, userId) => {
    let group = state.entries[groupId]
    if (group && group.members.includes(userId)) {
      return true
    }
    return false
  },
  get: state => (groupId) => {
    return state.entries[groupId] || {}
  }
}

export const actions = {

  async selectGroup ({ commit, state, dispatch }, { groupId }) {
    await dispatch('fetchGroup', { groupId })
    commit(types.SELECT_GROUP, { group: getters.get(state)(groupId) })
    dispatch('pickups/fetchListByGroupId', { groupId }, { root: true })
    dispatch('stores/fetchListByGroupId', { groupId }, { root: true })
    dispatch('users/fetchList', null, { root: true })
    await dispatch('fetchGroupConversation', { groupId })
    dispatch('conversations/subscribe', { conversationId: getters.get(state)(groupId).conversationId }, { root: true })
  },

  async fetchGroup ({ commit }, { groupId }) {
    commit(types.REQUEST_GROUP)
    try {
      commit(types.RECEIVE_GROUP, { group: await groups.get(groupId) })
    }
    catch (error) {
      commit(types.RECEIVE_GROUP_ERROR, { error })
    }
  },

  async fetchGroupConversation ({ commit }, { groupId }) {
    commit(types.REQUEST_CONVERSATION, { groupId })
    try {
      const conversation = await groups.conversation(groupId)
      commit(types.RECEIVE_CONVERSATION, { groupId, conversationId: conversation.id })
      commit('conversations/' + conversationTypes.RECEIVE_CONVERSATION, { conversation }, { root: true })
    }
    catch (error) {
      commit(types.RECEIVE_CONVERSATION_ERROR, { error })
    }
  },

  async fetchGroups ({ commit }) {
    // fetch public group info
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
  [types.SELECT_GROUP] (state, { group }) {
    state.selected = group
  },
  [types.REQUEST_GROUP] (state) {},
  [types.RECEIVE_GROUP] (state, { group }) {
    Vue.set(state.entries, group.id, { ...state.entries[group.id], ...group })
  },
  [types.RECEIVE_GROUP_ERROR] (state, { error }) {},

  [types.REQUEST_CONVERSATION] (state, { groupId }) {
    // TODO set loading state
  },
  [types.RECEIVE_CONVERSATION] (state, { groupId, conversationId }) {
    Vue.set(state.entries, groupId, { ...state.entries[groupId], conversationId })
  },
  [types.RECEIVE_CONVERSATION_ERROR] (state, { error }) {
    // TODO
  },

  [types.REQUEST_GROUPS] (state) {
    state.isFetching = true
    state.error = null
  },
  [types.RECEIVE_GROUPS] (state, { groups }) {
    state.isFetching = false
    state.entries = indexById(groups)
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
