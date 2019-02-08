import Vue from 'vue'
import places from '@/places/api/places'
import { optionsFor } from '@/places/placeStatus'
import {
  createMetaModule,
  withMeta,
  metaStatuses,
  metaStatusesWithId,
  indexById,
  createRouteError,
  toggles,
} from '@/utils/datastore/helpers'
import router from '@/base/router'

function initialState () {
  return {
    entries: {},
    statistics: {},
    activePlaceId: null,
  }
}

export default {
  namespaced: true,
  modules: {
    meta: createMetaModule(),
    toggle: toggles({
      showAll: false,
    }),
  },
  state: initialState(),
  getters: {
    all: (state, getters) => Object.values(state.entries).map(getters.enrich).sort(sortByName).sort(sortByStatus),
    notArchived: (state, getters) => getters.all.filter(s => s.status !== 'archived'),
    archived: (state, getters) => getters.all.filter(s => s.status === 'archived'),
    filtered: (state, getters) => getters.notArchived.filter(place => getters['toggle/showAll'] || place.status === 'active'),
    byCurrentGroup: (state, getters, rootState, rootGetters) => getters.filtered.filter(({ group }) => group && group.isCurrentGroup),
    byCurrentGroupArchived: (state, getters, rootState, rootGetters) => getters.archived.filter(({ group }) => group && group.isCurrentGroup),
    get: (state, getters) => id => getters.enrich(state.entries[id]),
    enrich: (state, getters, rootState, rootGetters) => place => {
      return place && {
        ...place,
        ...metaStatusesWithId(getters, ['save'], place.id),
        ui: optionsFor(place),
        group: rootGetters['groups/get'](place.group),
        statistics: state.statistics[place.id],
        isActivePlace: place.id === state.activePlaceId,
      }
    },
    activePlace: (state, getters) => getters.get(state.activePlaceId),
    activePlaceId: state => state.activePlaceId,
    ...metaStatuses(['create']),
    conversation: (state, getters, rootState, rootGetters) => {
      if (!state.activePlaceId) return
      return rootGetters['conversations/getForPlace'](state.activePlaceId)
    },
  },
  actions: {
    ...withMeta({
      async save ({ dispatch }, place) {
        dispatch('update', [await places.save(place)])
        router.push({ name: 'place', params: { placeId: place.id } })
      },
      async create ({ dispatch, rootGetters }, place) {
        const createdPlace = await places.create({
          ...place,
          group: rootGetters['currentGroup/id'],
        })
        dispatch('update', [createdPlace])
        router.push({ name: 'place', params: { placeId: createdPlace.id } })
      },
      async fetch ({ commit }) {
        commit('set', await places.list())
      },

    }),
    ...withMeta({
      async selectPlace ({ commit, dispatch, getters }, { placeId }) {
        if (getters.activePlaceId === placeId) return
        if (!getters.get(placeId)) {
          try {
            const place = await places.get(placeId)
            commit('update', [place])
          }
          catch (error) {
            throw createRouteError()
          }
        }
        const getStatistics = places.statistics(placeId)
        dispatch('sidenavBoxes/toggle/group', false, { root: true })
        commit('select', placeId)
        commit('setStatistics', { data: await getStatistics, id: placeId })
      },
    }, {
      findId: ({ placeId }) => placeId,
    }),

    clearSelectedPlace ({ commit, dispatch, getters }, { routeTo }) {
      // do not clear if place stays the same
      const { placeId } = routeTo.params
      if (placeId && parseInt(placeId) === getters.activePlaceId) return

      dispatch('sidenavBoxes/toggle/group', true, { root: true })
      commit('clearSelected')
    },

    update ({ commit, dispatch, getters }, places) {
      for (const place of places) {
        const old = getters.get(place.id)
        // make sure we refresh pickups if place status changes
        // TODO move to vuex plugin in pickups module
        if (old && old.status !== place.status) {
          if (old.status === 'active' || place.status === 'active') {
            commit('pickups/clearUpcomingForPlace', old.id, { root: true })
            dispatch('pickups/fetchListByGroupId', old.group.id, { root: true })
          }
        }
      }
      commit('update', places)
    },
  },
  mutations: {
    select (state, placeId) {
      state.activePlaceId = placeId
    },
    clearSelected (state) {
      state.activePlaceId = null
    },
    set (state, places) {
      state.entries = indexById(places)
    },
    clear (state) {
      Object.assign(state, initialState())
    },
    update (state, places) {
      for (const place of places) {
        Vue.set(state.entries, place.id, place)
      }
    },
    setStatistics (state, { id, data }) {
      Vue.set(state.statistics, id, data)
    },
  },
}

export function sortByStatus (a, b) {
  return a.ui.sort - b.ui.sort
}

export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}
