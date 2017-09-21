import Vue from 'vue'
import groups from '@/services/api/groups'
import { indexById } from '@/store/helpers'
import router from '@/router'

export const types = {

  SET_ACTIVE: 'Set Active',
  SET_ACTIVE_PREVIEW: 'Set Active Preview',

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
  RECEIVE_LEAVE_ERROR: 'Receive Leave Error',

}

export const state = {
  entries: {},
  idsList: [],
  isFetching: false,
  error: null,
  activeGroupId: null,
  activeGroupPreviewId: null,
}

export const getters = {
  list: (state, getters, rootState, rootGetters) => {
    const userId = rootGetters['auth/userId']
    return state.idsList.map(id => state.entries[id]).map(e => {
      return {
        ...e,
        isMember: userId ? e.members.includes(userId) : false,
      }
    })
  },
  isFetching: state => state.isFetching,
  error: state => state.error,
  isMember: state => (groupId, userId) => {
    let group = state.entries[groupId]
    if (group && group.members.includes(userId)) {
      return true
    }
    return false
  },
  activeUserGroups: (state, getters, rootState, rootGetters) => {
    let activeUser = rootGetters['users/activeUser']
    return activeUser ? getters.list.filter(el => el.members.includes(activeUser.id)) : []
  },
  myGroups: (state, getters) => getters.list.filter(e => e.isMember === true).sort(sortByName),
  otherGroups: (state, getters) => getters.list.filter(e => e.isMember === false).sort(sortByMemberCount),
  get: (state, getters, rootState, rootGetters) => (groupId) => {
    const group = state.entries[groupId]
    const userId = rootGetters['auth/userId']
    return group && { ...group, isMember: userId ? group.members.includes(userId) : false }
  },
  activeGroup: (state, getters) => getters.get(state.activeGroupId),
  activeGroupInfo: (state, getters) => getters.get(state.activeGroupPreviewId),
  activeUsers: (state, getters, rootState, rootGetters) => {
    let group = getters.activeGroup
    if (!group) return []
    return group.members.map(id => rootGetters['users/get'](id))
  },
}

export const actions = {

  async selectGroup ({ commit, state, dispatch, getters, rootState }, { groupId }) {
    commit(types.SET_ACTIVE, { groupId })
    dispatch('pickups/fetchListByGroupId', { groupId }, { root: true })
    dispatch('stores/fetchListByGroupId', { groupId }, { root: true })
    try {
      dispatch('conversations/setActive', await groups.conversation(groupId), {root: true})
    }
    catch (error) {
      dispatch('conversations/clearActive')
    }
  },

  selectGroupInfo ({ commit }, groupPreviewId) {
    // TODO check if the group was fetched
    commit(types.SET_ACTIVE_PREVIEW, { groupPreviewId })
  },

  async fetchGroup ({ commit }, { groupId }) {
    // fetches group details, TODO put in different state
    commit(types.REQUEST_GROUP)
    try {
      commit(types.RECEIVE_GROUP, { group: await groups.get(groupId) })
    }
    catch (error) {
      commit(types.RECEIVE_GROUP_ERROR, { error })
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
      router.push({ name: 'group', params: { groupId } })
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
  },

}

export const mutations = {
  [types.SET_ACTIVE] (state, { groupId }) {
    state.activeGroupId = groupId
  },
  [types.SET_ACTIVE_PREVIEW] (state, { groupPreviewId }) {
    state.activeGroupPreviewId = groupPreviewId
  },
  [types.REQUEST_GROUP] (state) {},
  [types.RECEIVE_GROUP] (state, { group }) {
    Vue.set(state.entries, group.id, { ...state.entries[group.id], ...group })
  },
  [types.RECEIVE_GROUP_ERROR] (state, { error }) {},

  [types.REQUEST_GROUPS] (state) {
    state.isFetching = true
    state.error = null
  },
  [types.RECEIVE_GROUPS] (state, { groups }) {
    state.isFetching = false
    state.idsList = groups.map((group) => group.id)
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
  [types.RECEIVE_LEAVE_ERROR] (state, { error }) {},
}

export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}

export function sortByMemberCount (a, b) {
  return b.members.length - a.members.length
}
