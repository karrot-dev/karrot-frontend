import Vue from 'vue'
import { createMetaModule, withMeta, metaStatusesWithId } from '@/utils/datastore/helpers'

function initialState () {
  return {
    currentId: null,
    entries: {},
  }
}

const ITEMS = [
  {
    id: 234,
    name: 'A bike',
    user: 8,
    description: 'a very nice bike',
    photoUrls: {
      fullSize: 'https://freegle.azureedge.net/img_13104868.jpg?t=1571086599751',
    },
  },
  {
    id: 235,
    name: 'Lots of carrots',
    user: 183,
    description: 'Loads of carrots!',
    photoUrls: {
      fullSize: 'https://www.ilovefreegle.org/img_13160761.jpg?t=1571086622228',
    },
  },
  {
    id: 333,
    name: 'A lovely sofa',
    user: 183,
    description: 'Very comfy',
    photoUrls: {
      fullSize: 'https://www.ilovefreegle.org/img_13159573.jpg?t=1571089461810',
    },
  },
]

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: (state, getters) => pickupId => {
      return getters.enrich(state.entries[pickupId])
    },
    current: (state, getters) => {
      return getters.enrich(state.entries[state.currentId])
    },
    enrich: (state, getters, rootState, rootGetters) => item => {
      if (!item) return
      return {
        ...item,
        user: rootGetters['users/get'](item.user),
        ...metaStatusesWithId(getters, ['save'], item.id),
      }
    },
    all: (state, getters) => {
      return Object.values(state.entries)
        .map(getters.enrich)
    },
  },
  actions: {
    ...withMeta({
      async fetchList ({ commit }) {
        commit('update', ITEMS)
      },
    }),
    refresh ({ dispatch }) {
      dispatch('fetchList')
    },
    clear ({ commit }) {
      commit('clear')
    },
    ...withMeta({
      async select ({ dispatch }) {
        // clear right drawer
        // TODO can be removed once detail are bound to routes
        dispatch('detail/clear', null, { root: true })

        // would do a maybeFetchOne ...
      },
    }, {
      setCurrentId: ({ commit }, { itemId }) => commit('setCurrentItem', itemId),
      getCurrentId: ({ state }) => state.currentId,
      findId: ({ itemId }) => itemId,
    }),
  },
  mutations: {
    clear (state) {
      Object.assign(state, initialState())
    },
    update (state, items) {
      for (const item of items) {
        Vue.set(state.entries, item.id, item)
      }
    },
    delete (state, id) {
      if (state.entries[id]) Vue.delete(state.entries, id)
    },
    setCurrentItem (state, id) {
      state.currentId = id
    },
  },
}
