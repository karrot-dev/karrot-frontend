import Vue from 'vue'
import stores from '@/services/api/stores'
import { indexById } from '@/store/helpers'
import router from '@/router'

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
    isWaiting: false,
    error: null,
    activeStoreId: null,
  }
}

export const state = initialState()

export const getters = {
  all: state => state.idList.map(i => state.entries[i]).sort(sortByName),
  get: state => (id) => state.entries[id],
  withLocation: (state, getters) => getters.all.filter(e => e.longitude && e.latitude),
  activeStore: state => state.entries[state.activeStoreId] || {},
  activeStoreId: state => state.activeStoreId,
  status: state => { return { isWaiting: state.isWaiting, error: state.error } },
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

  async fetchListByGroupId ({ commit }, groupId) {
    commit(types.REQUEST_STORES)
    try {
      commit(types.RECEIVE_STORES, { stores: await stores.listByGroupId(groupId) })
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
      commit(types.RECEIVE_SAVE_ERROR, { error })
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
      const { response: { status = -1, data } = {} } = error
      if (status >= 400 && status < 500) {
        commit(types.RECEIVE_SAVE_ERROR, { error: { validationErrors: data } })
      }
      else {
        commit(types.RECEIVE_SAVE_ERROR, { error })
      }
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
    state.isWaiting = true
  },
  [types.RECEIVE_STORES] (state, { stores }) {
    state.isWaiting = false
    state.entries = indexById(stores)
    state.idList = stores.map(e => e.id)
  },
  [types.RECEIVE_STORES_ERROR] (state, { error }) {
    state.isWaiting = false
    state.error = error
  },
  [types.CLEAR] (state) {
    state.activeStoreId = null
    state.entries = {}
    state.idList = []
  },
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
