import Vue from 'vue'

import pickupSeries from '@/services/api/pickupSeries'
import { createMetaModule, withMeta, metaStatusesWithId, metaStatuses } from '@/store/helpers'

export const modules = { meta: createMetaModule() }

export const types = {
  RECEIVE_LIST: 'Receive List',
  CLEAR_LIST: 'Clear List',
  RECEIVE_ITEM: 'Receive Item',
}

function initialState () {
  return {
    entries: {},
    idList: [],
    idListStoreId: null,
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
      ...metaStatusesWithId(getters, ['save', 'destroy'], entry.id),
      __unenriched: entry,
    }
  },
  all: (state, getters, rootState, rootGetters) => {
    return state.idList.map(getters.get)
  },
  ...metaStatuses(['create']),
}

export const actions = {

  ...withMeta({

    async fetchListForActiveStore ({ commit, rootGetters }) {
      let storeId = rootGetters['stores/activeStoreId']
      commit(types.RECEIVE_LIST, { list: await pickupSeries.listByStoreId(storeId), storeId })
    },

    async create ({ commit, dispatch }, series) {
      await pickupSeries.create(series)
      dispatch('fetchListForActiveStore')
      dispatch('pickups/refresh', null, { root: true })
    },

    async save ({ commit, dispatch }, series) {
      let updatedSeries = await pickupSeries.save(series)
      commit(types.RECEIVE_ITEM, { series: updatedSeries })
      dispatch('pickups/refresh', null, { root: true })
    },

    async destroy ({ commit, dispatch }, id) {
      await pickupSeries.delete(id)
      dispatch('fetchListForActiveStore')
      dispatch('pickups/refresh', null, { root: true })
    },

  }),

  clearList ({ commit }) {
    commit(types.CLEAR_LIST)
  },

}

export const mutations = {
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
  },
  [types.CLEAR_LIST] (state) {
    state.entries = {}
    state.idList = []
    state.idListStoreId = null
  },
  [types.RECEIVE_ITEM] (state, { series }) {
    Vue.set(state.entries, series.id, series)
  },
}
