import activitySeries from '@/activities/api/activitySeries'
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
      const activities = rootGetters['activities/upcomingAndStarted']
        .filter(({ series }) => series === entry.id)
        .filter(p => !p.hasStarted)
        .map(activity => ({
          ...activity,
          seriesMeta: {
            isDescriptionChanged: entry.description !== activity.description,
            isMaxParticipantsChanged: entry.maxParticipants !== activity.maxParticipants,
            matchesRule: entry.datesPreview && entry.datesPreview.some(d => Math.abs(d - activity.date) < 1000),
          },
        }))
      const place = rootGetters['places/get'](entry.place)
      const activityType = rootGetters['activityTypes/get'](entry.activityType)

      const firstDate = activities.length > 0 && activities[0].date
      const isSame = lookup => activities.every(p => p.date[lookup]() === firstDate[lookup]())
      const similarities = firstDate
        ? {
            isSameWeekday: isSame('getDay'),
            isSameHour: isSame('getHours'),
            isSameMinute: isSame('getMinutes'),
          }
        : {}

      return {
        ...entry,
        activities,
        place,
        activityType,
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
        const placeId = rootGetters['places/activePlaceId']
        if (placeId) {
          commit('set', await activitySeries.listByPlaceId(placeId))
        }
      },

      async create ({ commit, dispatch }, series) {
        await activitySeries.create(series)
        dispatch('fetchListForActivePlace')
      },

      async save ({ commit, dispatch }, series) {
        const updatedSeries = await activitySeries.save(series)
        commit('update', [updatedSeries])
      },

      async destroy ({ commit, dispatch }, id) {
        await activitySeries.delete(id)
        dispatch('fetchListForActivePlace')
      },

    }),

    clearList ({ commit }) {
      commit('clearList')
    },
  },
  mutations: {
    set (state, list) {
      state.entries = Object.freeze(indexById(list))
    },
    clearList (state) {
      state.entries = {}
    },
    update (state, seriesList) {
      state.entries = Object.freeze({ ...state.entries, ...indexById(seriesList) })
    },
    delete (state, seriesId) {
      if (!state.entries[seriesId]) return
      const { [seriesId]: _, ...rest } = state.entries
      Object.freeze(rest)
      state.entries = rest
    },
  },
}

export const plugin = datastore => {
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('activitySeries/clearList')
    }
  })
}
