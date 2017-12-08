import Vue from 'vue'
import pickupSeries from '@/services/api/pickupSeries'
import { createMetaModule, withMeta, metaStatusesWithId, metaStatuses } from '@/store/helpers'

function initialState () {
  return {
    entries: {},
    idList: [],
    idListStoreId: null,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => id => {
      return getters.enrich(state.entries[id])
    },
    enrich: (state, getters, rootState, rootGetters) => entry => {
      const pickups = rootGetters['pickups/all'].filter(pickup => pickup.series === entry.id)
      return entry && {
        ...entry,
        pickups,
        ...metaStatusesWithId(getters, ['save', 'destroy'], entry.id),
      }
    },
    all: (state, getters, rootState, rootGetters) => {
      return state.idList.map(getters.get)
    },
    ...metaStatuses(['create']),
  },
  actions: {

    ...withMeta({

      async fetchListForActiveStore ({ commit, rootGetters }) {
        let storeId = rootGetters['stores/activeStoreId']
        commit('set', { list: await pickupSeries.listByStoreId(storeId), storeId })
      },

      async create ({ commit, dispatch }, series) {
        await pickupSeries.create(series)
        dispatch('fetchListForActiveStore')
        dispatch('pickups/refresh', null, { root: true })
      },

      async save ({ commit, dispatch }, series) {
        let updatedSeries = await pickupSeries.save(series)
        commit('update', updatedSeries)
        dispatch('pickups/refresh', null, { root: true })
      },

      async destroy ({ commit, dispatch }, id) {
        await pickupSeries.delete(id)
        dispatch('fetchListForActiveStore')
        dispatch('pickups/refresh', null, { root: true })
      },

    }),

    clearList ({ commit }) {
      commit('clearList')
    },
  },
  mutations: {
    set (state, { list, storeId }) {
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
    clearList (state) {
      state.entries = {}
      state.idList = []
      state.idListStoreId = null
    },
    update (state, series) {
      Vue.set(state.entries, series.id, series)
    },
  },
}
