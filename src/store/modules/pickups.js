import Vue from 'vue'
import pickups from '@/services/api/pickups'
import { onlyHandleAPIError, defineRequestModule } from '@/store/helpers'

const joinLeave = defineRequestModule()
export const modules = { joinLeave }

export const types = {

  SET_STORE_ID_FILTER: 'Set storeIdFilter',
  CLEAR_STORE_ID_FILTER: 'Clear storeIdFilter',

  REQUEST_LIST: 'Request List',
  RECEIVE_LIST: 'Receive List',
  RECEIVE_LIST_ERROR: 'Receive List Error',

  REQUEST_ITEM: 'Request Item',
  RECEIVE_ITEM: 'Receive Item',
  RECEIVE_ITEM_ERROR: 'Receive Item Error',

  JOIN: 'Join',
  LEAVE: 'Leave',

  REQUEST_SAVE: 'Request Save',
  RECEIVE_SAVE: 'Receive Save',
  RECEIVE_SAVE_ERROR: 'Receive Save Error',

  CLEAR: 'Clear',

}

function initialState () {
  return {
    entries: {},
    idList: [],
    idListGroupId: null,
    storeIdFilter: null,
    saveStatus: {
      isWaiting: null,
      error: null,
    },
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
      isWaiting: !!getters['joinLeave/get'](pickup.id).isWaiting,
      isUserMember: pickup.collectorIds.includes(userId),
      isEmpty: pickup.collectorIds.length === 0,
      isFull: pickup.maxCollectors > 0 && pickup.collectorIds.length >= pickup.maxCollectors,
      store: rootGetters['stores/get'](pickup.store),
      collectors: pickup.collectorIds.map(rootGetters['users/get']),
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
  saveStatus: state => state.saveStatus,
  saveIsWaiting: state => state.saveStatus.isWaiting,
  saveError: (state, getters) => field => getters.saveStatus.error && getters.saveStatus.error[field] && getters.saveStatus.error[field][0],
}

export const actions = {

  async fetch ({ commit }, pickupId) {
    commit(types.REQUEST_ITEM)
    try {
      commit(types.RECEIVE_ITEM, { pickup: await pickups.get(pickupId) })
    }
    catch (error) {
      commit(types.RECEIVE_ITEM_ERROR, { error })
    }
  },

  setStoreFilter ({ commit }, storeId) {
    commit(types.SET_STORE_ID_FILTER, { storeId })
  },

  clear ({ commit }) {
    commit(types.CLEAR)
  },

  clearStoreFilter ({ commit }) {
    commit(types.CLEAR_STORE_ID_FILTER)
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

  async fetchListByGroupId ({ commit }, groupId) {
    commit(types.REQUEST_LIST)
    try {
      commit(types.RECEIVE_LIST, { pickups: await pickups.listByGroupId(groupId), groupId })
    }
    catch (error) {
      commit(types.RECEIVE_LIST_ERROR, { error })
    }
  },

  async join ({ commit, dispatch, rootGetters }, pickupId) {
    dispatch('joinLeave/request', {
      id: pickupId,
      async run () {
        await pickups.join(pickupId)
        commit(types.JOIN, { pickupId, userId: rootGetters['auth/userId'] })
      },
      onValidationError () {
        // it would be nice to use plain try-catch instead of this
        dispatch('fetch', { pickupId })
      },
    })
  },

  async leave ({ commit, dispatch, rootGetters }, pickupId) {
    dispatch('joinLeave/request', {
      id: pickupId,
      async run () {
        await pickups.leave(pickupId)
        commit(types.LEAVE, { pickupId, userId: rootGetters['auth/userId'] })
      },
      onValidationError () {
        dispatch('fetch', { pickupId })
      },
    })
  },

  async save ({ commit, dispatch }, pickup) {
    commit(types.REQUEST_SAVE)
    let updatedPickup
    try {
      updatedPickup = await pickups.save(pickup)
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_SAVE_ERROR, data))
      return
    }
    commit(types.RECEIVE_SAVE)
    commit(types.RECEIVE_ITEM, { pickup: updatedPickup })
  },

  async create ({ commit, dispatch }, data) {
    commit(types.REQUEST_SAVE)
    try {
      await pickups.create(data)
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_SAVE_ERROR, data))
      return
    }
    commit(types.RECEIVE_SAVE)
    dispatch('refresh')
  },

  async destroy ({ commit, dispatch }, id) {
    await pickups.delete(id)
    dispatch('refresh')
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
  [types.REQUEST_ITEM] (state) {},
  [types.RECEIVE_ITEM] (state, { pickup }) {
    Vue.set(state.entries, pickup.id, pickup)
  },
  [types.RECEIVE_ITEM_ERROR] (state, { error }) {},

  [types.REQUEST_LIST] (state) {},
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
    state.error = null
  },
  [types.RECEIVE_LIST_ERROR] (state, { error }) {
    state.error = error.message
  },

  [types.JOIN] (state, { pickupId, userId }) {
    state.entries[pickupId].collectorIds.push(userId)
  },
  [types.LEAVE] (state, { pickupId, userId }) {
    let { collectorIds } = state.entries[pickupId]
    let idx = collectorIds.indexOf(userId)
    if (idx !== -1) collectorIds.splice(idx, 1)
  },

  [types.REQUEST_SAVE] (state) {
    state.saveStatus.isWaiting = true
    state.saveStatus.error = null
  },
  [types.RECEIVE_SAVE] (state) {
    state.saveStatus.isWaiting = false
    state.saveStatus.error = null
  },
  [types.RECEIVE_SAVE_ERROR] (state, { error }) {
    state.saveStatus.isWaiting = false
    state.saveStatus.error = error
  },
}
