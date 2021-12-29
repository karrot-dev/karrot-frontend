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
import router from '@/router'

function initialState () {
  return {
    entries: {},
    statistics: {},
    activePlaceId: null,
  }
}

function placeRoute (place) {
  return place.defaultView === 'wall' ? 'placeWall' : 'placeActivities'
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
    filtered: (state, getters, rootState, rootGetters) => getters.notArchived
      .filter(place => getters['toggle/showAll'] || place.status === 'active' || place.isSubscribed)
      .map(place => {
        const conversationUnreadCount = rootGetters['status/getPlaceWallUnreadCount'](place.id)
        return {
          ...place,
          conversationUnreadCount,
        }
      }),
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
    activePlaceSubscribers: (state, getters, rootState, rootGetters) => {
      const place = getters.activePlace
      if (!place) return []
      return place.subscribers.map(userId => rootGetters['users/get'](userId))
    },
    ...metaStatuses(['create', 'fetch']),
    conversation: (state, getters, rootState, rootGetters) => {
      if (!state.activePlaceId) return
      return rootGetters['conversations/getForPlace'](state.activePlaceId)
    },
  },
  actions: {
    ...withMeta({
      async save ({ dispatch }, place) {
        dispatch('update', [await places.save(place)])
        router.push({ name: placeRoute(place), params: { placeId: place.id } }).catch(() => {})
      },
      async create ({ dispatch, rootGetters }, place) {
        const createdPlace = await places.create({
          ...place,
          group: rootGetters['currentGroup/id'],
        })
        dispatch('update', [createdPlace])
        router.push({ name: placeRoute(createdPlace), params: { placeId: createdPlace.id } }).catch(() => {})
      },
      async fetch ({ commit }) {
        commit('set', await places.list())
      },
      async subscribe (_, id) {
        await places.subscribe(id)
      },
      async unsubscribe (_, id) {
        await places.unsubscribe(id)
      },

    }),
    ...withMeta({
      async selectPlace ({ commit, dispatch, getters }, { placeId }) {
        if (!getters.get(placeId)) {
          let place
          try {
            place = await places.get(placeId)
          }
          catch (error) {
            throw createRouteError()
          }
          commit('update', [place])
        }
      },
    }, {
      findId: ({ placeId }) => placeId,
      setCurrentId: ({ commit }, { placeId }) => commit('select', placeId),
      getCurrentId: ({ state }) => state.activePlaceId,
    }),

    clearSelectedPlace ({ commit, dispatch }, { routeTo }) {
      // do not clear if we stay on a place route
      const { placeId } = routeTo.params
      if (placeId) return

      commit('clearSelected')
    },

    async beforeEnterFeedback ({ commit, dispatch }, { placeId }) {
      dispatch('feedback/fetch', { placeId }, { root: true })
      commit('setStatistics', { data: await places.statistics(placeId), id: placeId })
    },

    update ({ commit, dispatch, getters }, places) {
      for (const place of places) {
        const old = getters.get(place.id)
        // make sure we refresh activities if place status changes
        // TODO move to vuex plugin in activities module
        if (old && old.status !== place.status) {
          if (old.status === 'active' || place.status === 'active') {
            commit('activities/clearUpcomingForPlace', old.id, { root: true })
            dispatch('activities/fetchListByGroupId', old.group.id, { root: true })
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
      state.entries = Object.freeze(indexById(places))
    },
    clear (state) {
      Object.assign(state, initialState())
    },
    update (state, places) {
      state.entries = Object.freeze({ ...state.entries, ...indexById(places) })
    },
    setStatistics (state, { id, data }) {
      Vue.set(state.statistics, id, Object.freeze(data))
    },
  },
}

export function sortByStatus (a, b) {
  return a.ui.sort - b.ui.sort
}

export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}
