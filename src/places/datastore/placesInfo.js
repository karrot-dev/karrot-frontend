import Vue from 'vue'
import placesInfoAPI from '@/places/api/placesInfo'
import {
  createMetaModule,
  withMeta,
  metaStatuses,
  createRouteError,
} from '@/utils/datastore/helpers'

function initialState () {
  return {
    entries: {},
    activeId: null,
  }
}

export default {
  namespaced: true,
  modules: {
    meta: createMetaModule(),
  },
  state: initialState(),
  getters: {
    all: (state, getters) => Object.values(state.entries).map(getters.enrich),
    get: (state, getters) => id => getters.enrich(state.entries[id]),
    enrich: (state, getters, rootState, rootGetters) => place => {
      return place && {
        ...place,
        group: rootGetters['groups/get'](place.group),
        isActive: place.id === state.activeId,
      }
    },
    forActivePreview: (state, getters, rootState, rootGetters) => {
      const activePreview = rootGetters['groups/activePreview']
      if (!activePreview) return []
      return getters.all.filter(place => place.group && place.group.id === activePreview.id)
    },
    activePlace: (state, getters) => getters.get(state.activeId),
    activeId: state => state.activeId,
    ...metaStatuses(['fetch']),
  },
  actions: {
    ...withMeta({
      async fetch ({ commit }) {
        commit('update', await placesInfoAPI.list())
      },
    }),
    ...withMeta({
      async select ({ commit, getters }, { placeInfoId }) {
        if (!getters.get(placeInfoId)) {
          let place
          try {
            place = await placesInfoAPI.get(placeInfoId)
          }
          catch (error) {
            throw createRouteError()
          }
          commit('update', [place])
        }
      },
    }, {
      findId: ({ placeInfoId }) => placeInfoId,
      setCurrentId: ({ commit }, { placeInfoId }) => commit('select', placeInfoId),
      getCurrentId: ({ state }) => state.activeId,
    }),
    clearSelected ({ commit }) {
      commit('clearSelected')
    },
  },
  mutations: {
    select (state, placeId) {
      state.activeId = placeId
    },
    clearSelected (state) {
      state.activeId = null
    },
    clear (state) {
      Object.assign(state, initialState())
    },
    update (state, places) {
      for (const place of places) {
        Vue.set(state.entries, place.id, place)
      }
    },
  },
}
