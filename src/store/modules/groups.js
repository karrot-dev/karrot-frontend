import Vue from 'vue'
import groups from '@/services/api/groups'
import groupsInfo from '@/services/api/groupsInfo'
import router from '@/router'
import { indexById, withMeta, createMetaModule, metaStatusesWithId, metaStatuses, createRouteError } from '@/store/helpers'

function initialState () {
  return {
    entries: {},
    idsList: [],
    activePreviewId: null,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => groupId => {
      return getters.enrich(state.entries[groupId])
    },
    enrich: (state, getters, rootState, rootGetters) => group => {
      if (!group) return
      const userId = rootGetters['auth/userId']
      const isMember = userId && group.members ? group.members.includes(userId) : false
      return {
        ...group,
        isMember,
        ...metaStatusesWithId(getters, ['save', 'join', 'leave'], group.id),
      }
    },
    all: (state, getters, rootState, rootGetters) => {
      return state.idsList.map(getters.get)
    },
    activeUserGroups: (state, getters, rootState, rootGetters) => {
      let activeUser = rootGetters['users/activeUser']
      return activeUser ? getters.all.filter(el => el.members.includes(activeUser.id)) : []
    },
    mine: (state, getters) => getters.all.filter(e => e.isMember).sort(sortByName),
    // A de-duplicated list of member ids of all groups the user is part of
    myMemberIds: (state, getters) => {
      return Object.keys(getters.mine.reduce((obj, group) => {
        for (let member of group.members) {
          obj[member] = true
        }
        return obj
      }, {})).sort()
    },
    other: (state, getters) => getters.all.filter(e => !e.isMember).sort(sortByMemberCount),
    activePreview: (state, getters) => getters.get(state.activePreviewId),
    saveStatus: (state, getters, rootState, rootGetters) => {
      const currentGroupId = rootGetters['currentGroup/id']
      return getters.get(currentGroupId).saveStatus
    },
    ...metaStatuses(['create']),
  },
  actions: {
    ...withMeta({
      async save ({ commit, dispatch }, group) {
        commit('update', await groups.save(group))
        dispatch('currentGroup/update', group, { root: true })
        router.push({ name: 'group', params: { groupId: group.id } })
      },

      async join ({ commit, dispatch, rootGetters }, { id: groupId, password }) {
        await groups.join(groupId, { password })
        commit('join', { groupId, userId: rootGetters['auth/userId'] })
        router.push({ name: 'group', params: { groupId } })
      },

      async leave ({ commit, dispatch, getters, rootGetters }, groupId) {
        await groups.leave(groupId)
        commit('leave', { groupId, userId: rootGetters['auth/userId'] })
        dispatch('alerts/create', {
          type: 'groupLeaveSuccess',
          context: { groupName: getters.get(groupId).name },
        }, { root: true })
        router.push({ name: 'groupsGallery' })
      },

      async create ({ commit, dispatch }, group) {
        const createdGroup = await groups.create(group)
        commit('update', createdGroup)
        router.push({ name: 'group', params: { groupId: createdGroup.id } })
      },

      async fetch ({ commit }) {
        commit('set', await groupsInfo.list())
      },
    }),

    async selectPreview ({ commit, getters, dispatch }, { groupPreviewId }) {
      if (!getters.get(groupPreviewId)) {
        try {
          const group = await groupsInfo.get(groupPreviewId)
          commit('update', group)
        }
        catch (error) {
          throw createRouteError()
        }
      }
      commit('setActivePreview', groupPreviewId)
    },
    clearGroupPreview ({ commit }) {
      commit('setActivePreview', null)
    },
  },
  mutations: {
    setActivePreview (state, previewId) {
      state.activePreviewId = previewId
    },
    set (state, groups) {
      state.idsList = groups.map((group) => group.id)
      state.entries = indexById(groups)
    },
    update (state, group) {
      Vue.set(state.entries, group.id, group)
      if (!state.idsList.includes(group.id)) {
        state.idsList.push(group.id)
      }
    },
    join (state, { groupId, userId }) {
      let { members } = state.entries[groupId]
      if (!members.includes(userId)) members.push(userId)
    },
    leave (state, { groupId, userId }) {
      let { members } = state.entries[groupId]
      let idx = members.indexOf(userId)
      if (idx !== -1) members.splice(idx, 1)
    },
  },
}

export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}

export function sortByMemberCount (a, b) {
  return b.members.length - a.members.length
}
