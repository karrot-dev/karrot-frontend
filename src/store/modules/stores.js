import Vue from 'vue'
import stores from '@/services/api/stores'
import { indexById, onlyHandleAPIError } from '@/store/helpers'
import router from '@/router'

const statusList = {
  created: {
    label: 'STORESTATUS.CREATED',
    color: 'grey',
    icon: 'fa-circle-o',
    selectable: true,
    sort: 3,
  },
  negotiating: {
    label: 'STORESTATUS.NEGOTIATING',
    color: 'blue',
    icon: 'fa-circle',
    selectable: true,
    sort: 2,
  },
  active: {
    label: 'STORESTATUS.ACTIVE',
    color: 'green',
    icon: 'fa-circle',
    selectable: true,
    sort: 1,
  },
  declined: {
    label: 'STORESTATUS.DECLINED',
    color: 'red',
    icon: 'fa-circle',
    selectable: true,
    sort: 4,
  },
  archived: {
    label: 'STORESTATUS.ARCHIVED',
    color: 'grey',
    icon: 'fa-trash',
    selectable: false,
    hidden: true,
  },
}

export const types = {

  SELECT_STORE: 'Select Store',
  CLEAR_SELECTED_STORE: 'Clear Selected Store',

  REQUEST_STORES: 'Request Stores',
  RECEIVE_STORES: 'Receive Stores',
  RECEIVE_STORES_ERROR: 'Receive Stores Error',

  REQUEST_SAVE: 'Request Save',
  RECEIVE_SAVE: 'Receive Save',
  RECEIVE_SAVE_ERROR: 'Receive Save Error',

  RECEIVE_ITEM: 'Receive Item',

  CLEAR: 'Clear',
}

function initialState () {
  return {
    entries: {},
    idList: [],
    status: {
      isWaiting: false,
      error: null,
    },
    activeStoreId: null,
  }
}

export const state = initialState()

export const getters = {
  all: state => state.idList.map(i => state.entries[i]).sort(sortByName),
  byActiveGroup: (state, getters, rootState, rootGetters) => getters.all.filter(e => e.group === rootGetters['groups/activeGroupId']),
  get: state => (id) => state.entries[id],
  activeStore: state => state.entries[state.activeStoreId] || {},
  activeStoreId: state => state.activeStoreId,
  status: state => { return { isWaiting: state.isWaiting, error: state.error } },
  error: (state, getters) => field => getters.status.error && getters.status.error[field] && getters.status.error[field][0],
  statusList: () => Object.keys(statusList).map(key => Object.assign({key}, statusList[key])),
  statusObj: () => statusList,
}

export const actions = {
  async selectStore ({ commit, state, dispatch, getters, rootState }, storeId) {
    dispatch('pickups/setStoreFilter', storeId, {root: true})
    commit(types.SELECT_STORE, { storeId })
  },

  async clearSelectedStore ({ commit, dispatch }) {
    dispatch('pickups/clearStoreFilter', null, { root: true })
    commit(types.CLEAR_SELECTED_STORE)
  },

  async fetchList ({ commit }) {
    commit(types.REQUEST_STORES)
    try {
      commit(types.RECEIVE_STORES, { stores: await stores.list() })
    }
    catch (error) {
      commit(types.RECEIVE_STORES_ERROR, { error })
    }
  },

  async save ({ commit, dispatch }, store) {
    commit(types.REQUEST_SAVE)
    let updatedStore
    try {
      updatedStore = await stores.save(store)
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_SAVE_ERROR, data))
      return
    }
    commit(types.RECEIVE_SAVE)
    commit(types.RECEIVE_ITEM, { store: updatedStore })
    router.push({ name: 'store', params: { storeId: updatedStore.id } })
  },

  async create ({ commit, dispatch, rootGetters }, store) {
    commit(types.REQUEST_SAVE)
    let createdStore
    try {
      createdStore = await stores.create({
        ...store,
        group: rootGetters['groups/activeGroupId'],
      })
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_SAVE_ERROR, data))
      return
    }
    commit(types.RECEIVE_SAVE)
    commit(types.RECEIVE_ITEM, { store: createdStore })
    router.push({ name: 'store', params: { storeId: createdStore.id } })
  },

  clear ({ commit, dispatch }) {
    commit(types.CLEAR)
  },
}

export const mutations = {
  [types.SELECT_STORE] (state, { storeId }) {
    state.activeStoreId = storeId
  },
  [types.CLEAR_SELECTED_STORE] (state) {
    state.activeStoreId = null
  },
  [types.REQUEST_STORES] (state) {
    state.status.isWaiting = true
  },
  [types.RECEIVE_STORES] (state, { stores }) {
    state.status.isWaiting = false
    state.entries = indexById(stores)
    state.idList = stores.map(e => e.id)
  },
  [types.RECEIVE_STORES_ERROR] (state, { error }) {
    state.status.isWaiting = false
    state.status.error = error
  },
  [types.CLEAR] (state) {
    state.activeStoreId = null
    state.entries = {}
    state.idList = []
  },
  [types.REQUEST_SAVE] (state) {
    state.status.isWaiting = true
    state.status.error = null
  },
  [types.RECEIVE_SAVE] (state) {
    state.status.isWaiting = false
    state.status.error = null
  },
  [types.RECEIVE_SAVE_ERROR] (state, { error }) {
    state.status.isWaiting = false
    state.status.error = error
  },
  [types.RECEIVE_ITEM] (state, { store }) {
    Vue.set(state.entries, store.id, store)
    if (!state.idList.includes(store.id)) {
      state.idList.push(store.id)
    }
  },
}

export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}
