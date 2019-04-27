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
      const pickups = rootGetters['pickups/upcomingAndStarted']
        .filter(({ series }) => series === entry.id)
        .filter(p => !p.hasStarted)
        .map(pickup => ({
          ...pickup,
          seriesMeta: {
            isDescriptionChanged: entry.description !== pickup.description,
            isMaxCollectorsChanged: entry.maxCollectors !== pickup.maxCollectors,
            matchesRule: entry.datesPreview && entry.datesPreview.some(d => Math.abs(d - pickup.date) < 1000),
          },
        }))
      const place = rootGetters['places/get'](entry.place)

      const firstDate = pickups.length > 0 && pickups[0].date
      const isSame = lookup => pickups.every(p => p.date[lookup]() === firstDate[lookup]())
      const similarities = firstDate ? {
        isSameWeekday: isSame('getDay'),
        isSameHour: isSame('getHours'),
        isSameMinute: isSame('getMinutes'),
      } : {}

      return {
        ...entry,
        pickups,
        place,
        ...similarities,
        ...metaStatusesWithId(getters, ['save', 'destroy'], entry.id),
      }
    },
    all: (state, getters) => {
      return Object.values(state.entries).map(getters.enrich)
    },
    byActivePlace: (state, getters) => {
      return getters.all.filter(series => series.place && series.place.isActivePlace)
    },
    ...metaStatuses(['create', 'fetchListForActivePlace']),
  },
  actions: {
    ...withMeta({
      async fetchListForActivePlace ({ commit, rootGetters }) {
        let placeId = rootGetters['places/activePlaceId']
        if (placeId) {
          commit('set', await pickupSeries.listByPlaceId(placeId))
        }
      },

      async create ({ commit, dispatch }, series) {
        await pickupSeries.create(series)
        dispatch('fetchListForActivePlace')
      },

      async save ({ commit, dispatch }, series) {
        let updatedSeries = await pickupSeries.save(series)
        commit('update', [updatedSeries])
      },

      async destroy ({ commit, dispatch }, id) {
        await pickupSeries.delete(id)
        dispatch('fetchListForActivePlace')
      },

    }),

    clearList ({ commit }) {
      commit('clearList')
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
