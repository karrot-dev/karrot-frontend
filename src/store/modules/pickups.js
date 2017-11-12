import Vue from 'vue'
import pickups from '@/services/api/pickups'
import { createMetaModule, withMeta, isValidationError, withPrefixedIdMeta, metaStatusesWithId, metaStatuses } from '@/store/helpers'

export const modules = { meta: createMetaModule() }

export const types = {
  SET_STORE_ID_FILTER: 'Set storeIdFilter',
  CLEAR_STORE_ID_FILTER: 'Clear storeIdFilter',
  RECEIVE_LIST: 'Receive List',
  RECEIVE_ITEM: 'Receive Item',
  JOIN: 'Join',
  LEAVE: 'Leave',
  CLEAR: 'Clear',
}

function initialState () {
  return {
    entries: {},
    idList: [],
    idListGroupId: null,
    storeIdFilter: null,
  }
}
export const state = initialState()

export const getters = {
  get: (state, getters, rootState, rootGetters) => pickupId => {
    return getters.enrich(state.entries[pickupId])
  },
  enrich: (state, getters, rootState, rootGetters) => pickup => {
    const userId = rootGetters['auth/userId']
    return pickup && {
      ...pickup,
      isUserMember: pickup.collectorIds.includes(userId),
      isEmpty: pickup.collectorIds.length === 0,
      isFull: pickup.maxCollectors > 0 && pickup.collectorIds.length >= pickup.maxCollectors,
      store: rootGetters['stores/get'](pickup.store),
      collectors: pickup.collectorIds.map(rootGetters['users/get']),
      ...metaStatusesWithId(getters, ['save', 'join', 'leave'], pickup.id),
      __unenriched: pickup,
    }
  },
  all: (state, getters, rootState, rootGetters) => {
    return state.idList.map(getters.get)
  },
  filtered: (state, getters) => {
    return getters.all.filter(e => !state.storeIdFilter || (e.store && e.store.id === state.storeIdFilter))
  },
  filteredOneTime: (state, getters) => {
    return getters.filtered.filter(e => !e.series)
  },
  joined: (state, getters) => getters.all.filter(e => e.isUserMember),
  empty: (state, getters) => {
    return getters.all.filter((e) => {
      let nextWeek = new Date(+new Date() + 6096e5)
      return e.collectorIds.length < 1 && e.date < nextWeek
    })
  },
  mine: (state, getters, rootState, rootGetters) => {
    if (!rootGetters['auth/isLoggedIn']) return []
    return getters.all.filter(e => e.collectorIds.includes(rootGetters['auth/userId']))
  },
  // isCreating: (state, getters) => getters['meta/pendingByAction']('create'),
  // createValidationErrors: (state, getters) => getters['meta/validationErrors']('create'),
  ...metaStatuses(['create']),
}

export const actions = {

  ...withMeta({

    async fetch ({ commit }, pickupId) {
      commit(types.RECEIVE_ITEM, { pickup: await pickups.get(pickupId) })
    },

    async fetchList ({ commit }) {
      commit(types.RECEIVE_LIST, { pickups: await pickups.list() })
    },

    async join ({ commit, dispatch, rootGetters }, pickupId) {
      try {
        await pickups.join(pickupId)
        commit(types.JOIN, {pickupId, userId: rootGetters['auth/userId']})
      }
      catch (error) {
        if (isValidationError(error)) dispatch('fetch', { pickupId })
        throw error
      }
    },

    async leave ({ commit, dispatch, rootGetters }, pickupId) {
      try {
        await pickups.leave(pickupId)
        commit(types.LEAVE, { pickupId, userId: rootGetters['auth/userId'] })
      }
      catch (error) {
        if (isValidationError(error)) dispatch('fetch', { pickupId })
        throw error
      }
    },

    async save ({ commit, dispatch }, pickup) {
      commit(types.RECEIVE_ITEM, { pickup: await pickups.save(pickup) })
    },

    async create ({ commit, dispatch }, data) {
      await pickups.create(data)
      dispatch('refresh')
    },

    async destroy ({ commit, dispatch }, id) {
      await pickups.delete(id)
      dispatch('refresh')
    },

  }),

  ...withPrefixedIdMeta('group/', {

    async fetchListByGroupId ({ commit }, groupId) {
      commit(types.RECEIVE_LIST, { pickups: await pickups.listByGroupId(groupId), groupId })
    },

  }),

  clear ({ commit }) {
    commit(types.CLEAR)
  },

  clearStoreFilter ({ commit }) {
    commit(types.CLEAR_STORE_ID_FILTER)
  },

  setStoreFilter ({ commit }, storeId) {
    commit(types.SET_STORE_ID_FILTER, { storeId })
  },

  refresh ({ state, dispatch }) {
    if (state.idListGroupId) {
      dispatch('fetchListByGroupId', state.idListGroupId)
    }
    else {
      dispatch('fetchList')
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
    Object.entries(initialState())
      .forEach(([prop, value]) => Vue.set(state, prop, value))
  },
  [types.RECEIVE_ITEM] (state, { pickup }) {
    Vue.set(state.entries, pickup.id, pickup)
  },
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
  },
  [types.JOIN] (state, { pickupId, userId }) {
    state.entries[pickupId].collectorIds.push(userId)
  },
  [types.LEAVE] (state, { pickupId, userId }) {
    let { collectorIds } = state.entries[pickupId]
    let idx = collectorIds.indexOf(userId)
    if (idx !== -1) collectorIds.splice(idx, 1)
  },
}
