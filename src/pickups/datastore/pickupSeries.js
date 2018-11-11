import Vue from 'vue'
import pickupSeries from '@/pickups/api/pickupSeries'
import { createMetaModule, withMeta, metaStatusesWithId, metaStatuses, indexById } from '@/utils/datastore/helpers'

function initialState () {
  return {
    entries: {},
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
      if (!entry) return
      const pickups = rootGetters['pickups/all'].filter(pickup => pickup.series === entry.id)
      const store = rootGetters['stores/get'](entry.store)
      return {
        ...entry,
        pickups,
        store,
        ...metaStatusesWithId(getters, ['save', 'destroy'], entry.id),
      }
    },
    all: (state, getters) => {
      return Object.values(state.entries).map(getters.enrich)
    },
    byActiveStore: (state, getters) => {
      return getters.all.filter(series => series.store && series.store.isActiveStore)
    },
    ...metaStatuses(['create']),
  },
  actions: {
    ...withMeta({
      async fetchListForActiveStore ({ commit, rootGetters }) {
        let storeId = rootGetters['stores/activeStoreId']
        if (storeId) {
          commit('set', await pickupSeries.listByStoreId(storeId))
        }
      },

      async create ({ commit, dispatch }, series) {
        await pickupSeries.create(series)
        dispatch('fetchListForActiveStore')
      },

      async save ({ commit, dispatch }, series) {
        let updatedSeries = await pickupSeries.save(series)
        commit('update', [updatedSeries])
      },

      async destroy ({ commit, dispatch }, id) {
        await pickupSeries.delete(id)
        dispatch('fetchListForActiveStore')
      },

    }),

    clearList ({ commit }) {
      commit('clearList')
    },

    refresh ({ dispatch }) {
      dispatch('fetchListForActiveStore')
    },
  },
  mutations: {
    set (state, list) {
      state.entries = indexById(list)
    },
    clearList (state) {
      state.entries = {}
    },
    update (state, seriesList) {
      for (const series of seriesList) {
        Vue.set(state.entries, series.id, series)
      }
    },
    delete (state, seriesId) {
      if (state.entries[seriesId]) Vue.delete(state.entries, seriesId)
    },
  },
}
