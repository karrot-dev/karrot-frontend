import groups from '@/services/api/groups'
import groupsInfo from '@/services/api/groupsInfo'
import router from '@/router'
import { indexById, onlyHandleAPIError, withMeta, createMetaModule } from '@/store/helpers'
import { Toast } from 'quasar'
import i18n from '@/i18n'

// const meta = defineRequestModule()
export const modules = { meta: createMetaModule() }

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

  RECEIVE_TIMEZONES: 'Receive Timezones',
}

function initialState () {
  return {
    entries: {}, // public group details
    idsList: [],
    isWaiting: false,
    error: null,

    activeGroupId: null,
    activeGroup: null, // full group details

    activeGroupPreviewId: null,
    joinStatus: {
      isWaiting: false,
      error: null,
    },

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
      meta: getters['meta/byId'](group.id),
    }
  },
  all: (state, getters, rootState, rootGetters) => {
    return state.idsList.map(getters.get)
  },
  status: state => ({ isWaiting: state.isWaiting, error: state.error }),
  saveError: (state, getters) => {
    // access meta error getter with metaID
    // a bit cumbersome!
    // return getters['meta/error'](`save-${getters.activeGroupId}`)
  },
  error: (state, getters) => field => getters.status.error && getters.status.error[field] && getters.status.error[field][0],
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
  activeGroupAgreement: (state, getters) => getters.activeGroup && getters.activeGroup.activeAgreement,
  activeGroupId: (state) => state.activeGroupId,
  activeGroupInfo: (state, getters) => getters.get(state.activeGroupPreviewId),
  joinStatus: state => state.joinStatus,
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
}

export const actions = {

  ...withMeta({

    async save ({ commit, dispatch }, group) {
      commit(types.RECEIVE_GROUP, { group: await groups.save(group) })
      router.push({ name: 'group', params: { groupId: group.id } })
    },

    async join ({ commit, dispatch, rootGetters }, { groupId, password }) {
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

  }),

  async selectGroup ({ commit, state, dispatch, getters, rootState }, groupId) {
    if (state.activeGroupId === groupId) return

    commit(types.SET_ACTIVE, { groupId })

    try {
      await dispatch('fetchGroup', groupId)
    }
    catch (error) {
      router.replace('/notfound')
      return
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

  selectGroupInfo ({ commit, getters }, groupPreviewId) {
    if (!getters.get(groupPreviewId)) {
      router.replace('/notfound')
    }
    commit(types.SET_ACTIVE_PREVIEW, { groupPreviewId })
  },

  async fetchGroup ({ commit, rootGetters, dispatch }, groupId) {
    commit(types.REQUEST_GROUP)
    let group
    try {
      group = await groups.get(groupId)
    }
    catch (error) {
      commit(types.RECEIVE_GROUP_ERROR, { error })
      return
    }

    if (group.activeAgreement) {
      dispatch('agreements/fetch', group.activeAgreement, { root: true })
    }

    const userId = rootGetters['auth/userId']
    if (!group.members.includes(userId)) {
      Toast.create.warning(i18n.t('GROUP.NONMEMBER_REDIRECT'))
      throw new Error('user is not a member')
    }
    commit(types.RECEIVE_GROUP, { group })
  },

  async fetchTimezones ({ commit }) {
    const timezones = await groups.timezones()
    commit(types.RECEIVE_TIMEZONES, { timezones })
  },

  async join ({ commit, dispatch, rootGetters }, { groupId, password }) {
    commit(types.REQUEST_JOIN)
    try {
      await groups.join(groupId, { password })
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_JOIN_ERROR, data))
      return
    }
    commit(types.RECEIVE_JOIN, { groupId, userId: rootGetters['auth/userId'] })
    router.push({ name: 'group', params: { groupId } })
  },

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
    if (state.activeGroupId === group.id) {
      state.activeGroup = group
    }
  },
  [types.RECEIVE_GROUP_ERROR] (state, { error }) {},

  [types.REQUEST_GROUPS] (state) {
    state.isWaiting = true
    state.error = null
  },
  [types.RECEIVE_GROUPS] (state, { groups }) {
    state.isWaiting = false
    state.idsList = groups.map((group) => group.id)
    state.entries = indexById(groups)
  },
  [types.RECEIVE_GROUPS_ERROR] (state, { error }) {
    state.isWaiting = false
    state.error = error.message
  },

  [types.REQUEST_JOIN] (state) {
    state.joinStatus = {
      isWaiting: true,
      error: null,
    }
  },
  [types.RECEIVE_JOIN] (state, { groupId, userId }) {
    let { members } = state.entries[groupId]
    if (!members.includes(userId)) members.push(userId)
    state.joinStatus = {
      isWaiting: false,
      error: null,
    }
  },
  [types.RECEIVE_JOIN_ERROR] (state, { error }) {
    state.joinStatus = {
      isWaiting: false,
      error: error,
    }
  },

  [types.REQUEST_LEAVE] (state) {},
  [types.RECEIVE_LEAVE] (state, { groupId, userId }) {
    let { members } = state.entries[groupId]
    let idx = members.indexOf(userId)
    if (idx !== -1) members.splice(idx, 1)
  },
  [types.RECEIVE_LEAVE_ERROR] (state, { error }) {},

  [types.REQUEST_SAVE] (state) {
    state.isWaiting = true
    state.error = null
  },
  [types.RECEIVE_SAVE] (state) {
    state.isWaiting = false
    state.error = null
  },
  [types.RECEIVE_SAVE_ERROR] (state, { error }) {
    state.isWaiting = false
    state.error = error
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
