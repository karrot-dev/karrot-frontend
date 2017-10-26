import Vue from 'vue'

import pickupSeries from '@/services/api/pickupSeries'
import { onlyHandleAPIError } from '@/store/helpers'

export const types = {
  REQUEST_LIST: 'Request List',
  RECEIVE_LIST: 'Receive List',
  RECEIVE_LIST_ERROR: 'Receive List Error',
  CLEAR_LIST: 'Clear List',
  RECEIVE_ITEM: 'Receive Item',

  REQUEST_SAVE: 'Request Save',
  RECEIVE_SAVE: 'Receive Save',
  RECEIVE_SAVE_ERROR: 'Receive Save Error',
}

function initialState () {
  return {
    entries: {},
    idList: [],
    idListStoreId: null,
    error: null,
    saveStatus: {
      isWaiting: null,
      error: null,
    },
  }
}
export const state = initialState()

export const getters = {
  get: (state, getters, rootState, rootGetters) => id => {
    return getters.enrich(state.entries[id])
  },
  enrich: (state, getters, rootState, rootGetters) => entry => {
    const pickups = rootGetters['pickups/all'].filter(pickup => pickup.series === entry.id)
    return entry && {
      ...entry,
      pickups,
      __unenriched: entry,
    }
  },
  all: (state, getters, rootState, rootGetters) => {
    return state.idList.map(getters.get)
  },
  saveError: (state, getters, rootState, rootGetters) => field => {
    return state.saveStatus.error && state.saveStatus.error[field] && state.saveStatus.error[field][0]
  },
  saveIsWaiting: state => state.saveStatus.isWaiting,
}

export const actions = {

  async fetchListForActiveStore ({ commit, rootGetters }) {
    commit(types.REQUEST_LIST)
    try {
      let storeId = rootGetters['stores/activeStoreId']
      commit(types.RECEIVE_LIST, { list: await pickupSeries.listByStoreId(storeId), storeId })
    }
    catch (error) {
      commit(types.RECEIVE_LIST_ERROR, { error })
    }
  },

  clearList ({ commit }) {
    commit(types.CLEAR_LIST)
  },

  async create ({ commit, dispatch }, series) {
    commit(types.REQUEST_SAVE)
    try {
      await pickupSeries.create(series)
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_SAVE_ERROR, data))
      return
    }
    commit(types.RECEIVE_SAVE)
    dispatch('fetchListForActiveStore')
    dispatch('pickups/refresh', null, { root: true })
  },

  async save ({ commit, dispatch }, series) {
    commit(types.REQUEST_SAVE)
    let updatedSeries
    try {
      updatedSeries = await pickupSeries.save(series)
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_SAVE_ERROR, data))
      return
    }
    commit(types.RECEIVE_SAVE)
    commit(types.RECEIVE_ITEM, { series: updatedSeries })
    dispatch('pickups/refresh', null, { root: true })
  },

  async destroy ({ commit, dispatch }, id) {
    try {
      await pickupSeries.delete(id)
    }
    catch (error) {
      onlyHandleAPIError(error, data => commit(types.RECEIVE_SAVE_ERROR, data))
      return
    }
    dispatch('fetchListForActiveStore')
    dispatch('pickups/refresh', null, { root: true })
  },

}

export const mutations = {
  [types.REQUEST_LIST] (state) {},
  [types.RECEIVE_LIST] (state, { list, storeId }) {
    let entries = {}
    let ids = []
    for (let entry of list) {
      entries[entry.id] = entry
      ids.push(entry.id)
    }
    state.entries = entries
    state.idList = ids
    state.idListStoreId = storeId
    state.error = null
  },
  [types.RECEIVE_LIST_ERROR] (state, { error }) {
    state.error = error.message
  },
  [types.CLEAR_LIST] (state) {
    state.entries = {}
    state.idList = []
    state.idListStoreId = null
    state.error = null
  },
  [types.RECEIVE_ITEM] (state, { series }) {
    Vue.set(state.entries, series.id, series)
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
