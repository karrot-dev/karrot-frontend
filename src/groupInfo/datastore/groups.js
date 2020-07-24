import groups from '@/group/api/groups'
import groupsInfo from '@/groupInfo/api/groupsInfo'
import router from '@/base/router'
import { indexById, withMeta, createMetaModule, metaStatusesWithId, metaStatuses, createRouteError } from '@/utils/datastore/helpers'

function initialState () {
  return {
    entries: {},
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
      const myApplicationPending = rootGetters['applications/getMineInGroup'] && rootGetters['applications/getMineInGroup'](group.id)
      return {
        ...group,
        isMember,
        isCurrentGroup,
        isPlayground,
        isInactive,
        myApplicationPending,
        hasPhoto: group.photoUrls && group.photoUrls.fullSize,
        ...metaStatusesWithId(getters, ['save', 'join', 'leave'], group.id),
      }
    },
    all: (state, getters, rootState, rootGetters) => {
      return Object.values(state.entries).map(getters.enrich)
    },
    mine: (state, getters) => getters.all.filter(e => isMyGroup(e)).sort(applicationsFirstThenSortByName),
    isMemberGroups: (state, getters) => getters.all.filter(e => isMemberGroup(e)).sort(applicationsFirstThenSortByName),
    // A de-duplicated list of member ids of all groups the user is part of
    myMemberIds: (state, getters) => {
      return Object.keys(getters.mine.reduce((obj, group) => {
        for (const member of group.members) {
          obj[member] = true
        }
        return obj
      }, {})).map(parseInt).sort()
    },
    other: (state, getters) => getters.all.filter(e => !isMyGroup(e)).sort(sortByMemberCount),
    activePreview: (state, getters) => getters.get(state.activePreviewId),
    saveStatus: (state, getters, rootState, rootGetters) => {
      const currentGroup = getters.get(rootGetters['currentGroup/id'])
      return currentGroup && currentGroup.saveStatus
    },
    playground: (state, getters) => getters.all.find(g => g.isPlayground),
    hasPlayground: (state, getters) => Boolean(getters.playground),
    ...metaStatuses(['create', 'fetch']),
  },
  actions: {
    ...withMeta({
      async save ({ commit, dispatch }, group) {
        const data = await groups.save(group)
        commit('update', [data])
        dispatch('currentGroup/maybeUpdate', data, { root: true })
        router.push({ name: 'group', params: { groupId: group.id } }).catch(() => {})
      },

      async join ({ commit, rootGetters }, groupId) {
        await groups.join(groupId)
        router.push({ name: 'group', params: { groupId } }).catch(() => {})
      },

      async leave ({ commit, dispatch, getters, rootGetters }, groupId) {
        await groups.leave(groupId)
        dispatch('toasts/show', {
          message: 'GROUP.LEAVE_CONFIRMATION',
          messageParams: { groupName: getters.get(groupId).name },
        }, { root: true })
        dispatch('currentGroup/clear', null, { root: true })
        dispatch('auth/maybeBackgroundSave', { currentGroup: null }, { root: true })
        router.replace({ name: 'groupsGallery' }).catch(() => {})
      },

      async create ({ commit }, group) {
        const createdGroup = await groups.create(group)
        commit('update', [createdGroup])
        router.push({ name: 'group', params: { groupId: createdGroup.id } }).catch(() => {})
      },

      async fetch ({ commit }) {
        commit('set', await groupsInfo.list())
      },
    }),
    ...withMeta({
      async selectPreview ({ commit, getters, dispatch }, { groupPreviewId }) {
        if (!getters.get(groupPreviewId)) {
          let group
          try {
            group = await groupsInfo.get(groupPreviewId)
          }
          catch (error) {
            throw createRouteError({ translation: 'NOT_FOUND.EXPLANATION' })
          }
          commit('update', [group])
        }
        dispatch('applications/fetchMine', null, { root: true })
      },
    }, {
      findId: ({ groupPreviewId }) => groupPreviewId,
      setCurrentId: ({ commit }, { groupPreviewId }) => commit('setActivePreview', groupPreviewId),
      getCurrentId: ({ state }) => state.activePreviewId,
    }),
    clearGroupPreview ({ commit }) {
      commit('setActivePreview', null)
    },
  },
  mutations: {
    setActivePreview (state, previewId) {
      state.activePreviewId = previewId
    },
    set (state, groups) {
      state.entries = Object.freeze(indexById(groups))
    },
    update (state, groups) {
      state.entries = Object.freeze({ ...state.entries, ...indexById(groups) })
    },
  },
}

function applicationsFirstThenSortByName (a, b) {
  if (a.myApplicationPending && !b.myApplicationPending) {
    return -1
  }
  if (!a.myApplicationPending && b.myApplicationPending) {
    return 1
  }
  return a.name.localeCompare(b.name)
}

function sortByMemberCount (a, b) {
  return b.members.length - a.members.length
}

function isMyGroup (group) {
  return group.isMember || group.myApplicationPending
}

function isMemberGroup (group) {
  return group.isMember
}
