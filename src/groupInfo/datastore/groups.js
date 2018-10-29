import Vue from 'vue'
import groups from '@/group/api/groups'
import groupsInfo from '@/groupInfo/api/groupsInfo'
import router from '@/base/router'
import { indexById, withMeta, createMetaModule, metaStatusesWithId, metaStatuses, createRouteError } from '@/utils/datastore/helpers'

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
      const isCurrentGroup = group.id === rootGetters['currentGroup/id']
      const isPlayground = group.status === 'playground'
      const isInactive = group.status === 'inactive'
      return {
        ...group,
        isMember,
        isCurrentGroup,
        isPlayground,
        isInactive,
        ...metaStatusesWithId(getters, ['save', 'join', 'leave'], group.id),
      }
    },
    all: (state, getters, rootState, rootGetters) => {
      return state.idsList.map(getters.get)
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
      const currentGroup = getters.get(rootGetters['currentGroup/id'])
      return currentGroup && currentGroup.saveStatus
    },
    playground: (state, getters) => getters.all.find(g => g.isPlayground),
    hasPlayground: (state, getters) => Boolean(getters.playground),
    ...metaStatuses(['create']),
  },
  actions: {
    ...withMeta({
      async save ({ commit, dispatch }, group) {
        const data = await groups.save(group)
        commit('update', [data])
        dispatch('currentGroup/update', data, { root: true })
        router.push({ name: 'group', params: { groupId: group.id } })
      },

      async join ({ commit, rootGetters }, groupId) {
        await groups.join(groupId)
        commit('join', { groupId, userId: rootGetters['auth/userId'] })
        router.push({ name: 'group', params: { groupId } })
      },

      async leave ({ commit, dispatch, getters, rootGetters }, groupId) {
        await groups.leave(groupId)
        commit('leave', { groupId, userId: rootGetters['auth/userId'] })
        dispatch('toasts/show', {
          message: 'GROUP.LEAVE_CONFIRMATION',
          messageParams: { groupName: getters.get(groupId).name },
        }, { root: true })
        dispatch('currentGroup/clear', null, { root: true })
        dispatch('auth/maybeBackgroundSave', { currentGroup: null }, { root: true })
        router.replace({ name: 'groupsGallery' })
      },

      async create ({ commit }, group) {
        const createdGroup = await groups.create(group)
        commit('update', [createdGroup])
        router.push({ name: 'group', params: { groupId: createdGroup.id } })
      },

      async fetch ({ commit }) {
        commit('set', await groupsInfo.list())
      },
    }),
    joinPlayground ({ dispatch, getters }) {
      dispatch('join', { id: getters.playground.id })
    },

    async selectPreview ({ commit, getters, dispatch }, { groupPreviewId }) {
      if (!getters.get(groupPreviewId)) {
        try {
          const group = await groupsInfo.get(groupPreviewId)
          commit('update', [group])
        }
        catch (error) {
          throw createRouteError({ translation: 'NOT_FOUND.EXPLANATION' })
        }
      }
      commit('setActivePreview', groupPreviewId)
      dispatch('groupApplications/fetchMine', null, { root: true })
    },
    clearGroupPreview ({ commit }) {
      commit('setActivePreview', null)
    },

    refresh ({ dispatch }) {
      return dispatch('fetch')
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
    update (state, groups) {
      for (const group of groups) {
        Vue.set(state.entries, group.id, group)
        if (!state.idsList.includes(group.id)) {
          state.idsList.push(group.id)
        }
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
