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

export const state = {
  entries: {},
  idList: [],
  isFetching: false,
  error: null,
  activeStoreId: null,
}

export const getters = {
  all: state => state.idList.map(i => state.entries[i]),
  get: state => (id) => state.entries[id],
  withLocation: (state, getters) => getters.all.filter(e => e.longitude && e.latitude),
  activeStore: state => state.entries[state.activeStoreId] || {},
  activeStoreId: state => state.activeStoreId,
  status: state => { return { isFetching: state.isFetching, error: state.error } },
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
    const updatedStore = await stores.save(store)
    commit(types.RECEIVE_ITEM, { store: updatedStore })
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
      commit(types.RECEIVE_SAVE_ERROR, { error })
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
    state.isFetching = true
  },
  [types.RECEIVE_STORES] (state, { stores }) {
    state.isFetching = false
    state.entries = indexById(stores)
    state.idList = stores.map(e => e.id)
  },
  [types.RECEIVE_STORES_ERROR] (state, { error }) {
    state.isFetching = false
    state.error = error
  },
  [types.CLEAR] (state) {
    state.activeStoreId = null
    state.entries = {}
    state.idList = []
  },
  [types.REQUEST_SAVE] (state) {
    state.isFetching = true
    state.error = null
  },
  [types.RECEIVE_SAVE] (state) {
    state.isFetching = false
    state.error = null
  },
  [types.RECEIVE_SAVE_ERROR] (state, { error }) {
    state.isFetching = false
    state.error = error
  },
  [types.RECEIVE_ITEM] (state, { store }) {
    Vue.set(state.entries, store.id, store)
    if (!state.idList.includes(store.id)) {
      state.idList.push(store.id)
    }
    // TODO sort by name
  },
}
