import groups from '@/services/api/groups'
import groupsInfo from '@/services/api/groupsInfo'
import router from '@/router'
import { indexById, withMeta, createMetaModule, withPrefixedIdMeta, metaStatusesWithId, metaStatuses, createRouteError } from '@/store/helpers'

export const modules = { meta: createMetaModule() }

export const types = {
  SET_ACTIVE: 'Set Active',
  SET_ACTIVE_PREVIEW: 'Set Active Preview',
  RECEIVE_GROUP: 'Receive Group',
  RECEIVE_GROUPS: 'Receive Groups',
  RECEIVE_JOIN: 'Receive Join',
  RECEIVE_LEAVE: 'Receive Leave',
  RECEIVE_TIMEZONES: 'Receive Timezones',
}

function initialState () {
  return {
    entries: {}, // public group details
    idsList: [],
    activeGroupId: null,
    activeGroup: null, // full group details
    activeGroupPreviewId: null,
    timezones: null,
  }
}

export const state = initialState()

export const getters = {
  get: (state, getters, rootState, rootGetters) => groupId => {
    return getters.enrich(state.entries[groupId])
  },
  enrich: (state, getters, rootState, rootGetters) => group => {
    if (!group) return
    const userId = rootGetters['auth/userId']
    const activeAgreement = rootGetters['agreements/get'](group.activeAgreement)
    const isMember = userId ? group.members.includes(userId) : false
    const membership = isMember && group.memberships ? group.memberships[userId] : {}
    return {
      ...group,
      isMember,
      membership,
      activeAgreement,
      awaitingAgreement: !!(activeAgreement && activeAgreement.agreed === false),
      ...metaStatusesWithId(getters, ['save', 'join', 'leave'], group.id),
      __unenriched: group,
    }
  },
  all: (state, getters, rootState, rootGetters) => {
    return state.idsList.map(getters.get)
  },
  activeUserGroups: (state, getters, rootState, rootGetters) => {
    let activeUser = rootGetters['users/activeUser']
    return activeUser ? getters.all.filter(el => el.members.includes(activeUser.id)) : []
  },
  myGroups: (state, getters) => getters.all.filter(e => e.isMember).sort(sortByName),
  // A de-duplicated list of member ids of all groups the user is part of
  myGroupMemberIds: (state, getters) => {
    return Object.keys(getters.myGroups.reduce((obj, group) => {
      for (let member of group.members) {
        obj[member] = true
      }
      return obj
    }, {})).sort()
  },
  otherGroups: (state, getters) => getters.all.filter(e => !e.isMember).sort(sortByMemberCount),
  activeGroup: (state, getters) => getters.enrich(state.activeGroup) || {},
  activeGroupRoles: (state, getters) => getters.activeGroup.membership ? getters.activeGroup.membership.roles : [],
  activeGroupSaveStatus: (state, getters) => getters.activeGroup.saveStatus,
  activeGroupAgreement: (state, getters) => getters.activeGroup && getters.activeGroup.activeAgreement,
  activeGroupId: (state) => state.activeGroupId,
  activeGroupInfo: (state, getters) => getters.get(state.activeGroupPreviewId),
  timezones: state => {
    // q-autocomplete static data format
    if (state.timezones) {
      const tzlist = state.timezones.allTimezones.map(tz => ({ label: tz, value: tz }))
      return {
        field: 'value',
        list: tzlist,
      }
    }
    return {}
  },
  ...metaStatuses(['create']),
}

export const actions = {

  ...withMeta({

    async selectGroup ({ commit, state, dispatch, getters, rootState }, { groupId }) {
      if (state.activeGroupId === groupId) return

      commit(types.SET_ACTIVE, { groupId })

      await dispatch('fetchGroup', groupId)
      const hasError = getters['meta/status']('fetchGroup', groupId).hasValidationErrors
      if (hasError) {
        const groupExists = !!getters.get(groupId)
        const data = { translation: groupExists ? 'GROUP.NONMEMBER_REDIRECT' : 'NOT_FOUND.EXPLANATION' }
        throw createRouteError(data)
      }

      dispatch('pickups/clear', {}, { root: true })

      dispatch('pickups/fetchListByGroupId', groupId, { root: true })
      try {
        dispatch('conversations/setActive', await groups.conversation(groupId), {root: true})
      }
      catch (error) {
        dispatch('conversations/clearActive', {}, { root: true })
      }

      dispatch('auth/update', { currentGroup: groupId }, { root: true })
    },

    async save ({ commit, dispatch }, group) {
      commit(types.RECEIVE_GROUP, { group: await groups.save(group) })
      router.push({ name: 'group', params: { groupId: group.id } })
    },

    async join ({ commit, dispatch, rootGetters }, { id: groupId, password }) {
      await groups.join(groupId, { password })
      commit(types.RECEIVE_JOIN, { groupId, userId: rootGetters['auth/userId'] })
      router.push({ name: 'group', params: { groupId } })
    },

    async leave ({ commit, dispatch, getters, rootGetters }, groupId) {
      await groups.leave(groupId)
      commit(types.RECEIVE_LEAVE, { groupId, userId: rootGetters['auth/userId'] })
      dispatch('alerts/create', {
        type: 'groupLeaveSuccess',
        context: { groupName: getters.get(groupId).name },
      }, { root: true })
      router.push({ name: 'groupsGallery' })
    },

    async create ({ commit, dispatch }, group) {
      const createdGroup = await groups.create(group)
      commit(types.RECEIVE_GROUP, { group: createdGroup })
      router.push({ name: 'group', params: { groupId: createdGroup.id } })
    },

    async fetchGroupsPreview ({ commit }) {
      commit(types.RECEIVE_GROUPS, { groups: await groupsInfo.list() })
    },

    async fetchGroup ({ commit, rootGetters, dispatch }, groupId) {
      const group = await groups.get(groupId)
      if (group.activeAgreement) {
        dispatch('agreements/fetch', group.activeAgreement, { root: true })
      }
      const userId = rootGetters['auth/userId']
      if (!group.members.includes(userId)) {
        // TODO remove after refactoring of backend groups API
        throw Object.assign(new Error(), { response: { status: 404, data: { detail: 'Not found.' } } })
      }
      commit(types.RECEIVE_GROUP, { group })
    },

    async fetchTimezones ({ commit }) {
      const timezones = await groups.timezones()
      commit(types.RECEIVE_TIMEZONES, { timezones })
    },

  }),

  ...withPrefixedIdMeta('agreements/', {

    async activeGroupAgreementSave ({ commit, dispatch, state }, agreement) {
      let { activeGroup } = state
      let { id } = agreement
      if (id) {
        agreement = await dispatch('agreements/save', agreement, { root: true })
      }
      else {
        agreement = await dispatch('agreements/create', { ...agreement, group: activeGroup.id }, { root: true })
      }

      if (activeGroup.activeAgreement !== agreement.id) {
        commit(types.RECEIVE_GROUP, { group: await groups.save({ id: activeGroup.id, activeAgreement: agreement.id }) })
      }
    },

    async activeGroupAgreementReplace ({ commit, dispatch, state }, agreement) {
      let { activeGroupId } = state
      agreement = await dispatch('agreements/create', { ...agreement, group: activeGroupId }, { root: true })
      commit(types.RECEIVE_GROUP, { group: await groups.save({ id: activeGroupId, activeAgreement: agreement.id }) })
    },

    async activeGroupAgreementRemove ({ commit, dispatch, state }) {
      let { activeGroupId } = state
      commit(types.RECEIVE_GROUP, { group: await groups.save({ id: activeGroupId, activeAgreement: null }) })
    },

  }),

  selectGroupInfo ({ commit, getters, dispatch }, { groupInfoId }) {
    if (!getters.get(groupInfoId)) {
      throw createRouteError({ translation: 'no group found' })
    }
    commit(types.SET_ACTIVE_PREVIEW, { groupPreviewId: groupInfoId })
  },
  clearGroupInfo ({ commit }) {
    commit(types.SET_ACTIVE_PREVIEW, { groupPreviewId: null })
  },

}

export const mutations = {

  [types.SET_ACTIVE] (state, { groupId }) {
    state.activeGroupId = groupId
  },
  [types.SET_ACTIVE_PREVIEW] (state, { groupPreviewId }) {
    state.activeGroupPreviewId = groupPreviewId
  },
  [types.RECEIVE_GROUP] (state, { group }) {
    if (state.activeGroupId === group.id) {
      state.activeGroup = group
    }
  },
  [types.RECEIVE_GROUPS] (state, { groups }) {
    state.idsList = groups.map((group) => group.id)
    state.entries = indexById(groups)
  },
  [types.RECEIVE_JOIN] (state, { groupId, userId }) {
    let { members } = state.entries[groupId]
    if (!members.includes(userId)) members.push(userId)
  },
  [types.RECEIVE_LEAVE] (state, { groupId, userId }) {
    let { members } = state.entries[groupId]
    let idx = members.indexOf(userId)
    if (idx !== -1) members.splice(idx, 1)
  },
  [types.RECEIVE_TIMEZONES] (state, { timezones }) {
    state.timezones = timezones
  },
}

export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}

export function sortByMemberCount (a, b) {
  return b.members.length - a.members.length
}
