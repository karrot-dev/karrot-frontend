import Vue from 'vue'
import offers from '@/offers/api/offers'
import { createMetaModule, withMeta, metaStatusesWithId, createPaginationModule } from '@/utils/datastore/helpers'
import router from '@/base/router'

function initialState () {
  return {
    currentId: null,
    entries: {},
  }
}

/*
const OFFERS = [
  {
    id: 234,
    name: 'A bike',
    user: 8,
    description: `
a **very** nice bike

I had it for about _10 years_ (omg :) ) now, all good working order.
    `,
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
 */

export default {
  namespaced: true,
  modules: {
    meta: createMetaModule(),
    pagination: createPaginationModule(),
  },
  state: initialState(),
  getters: {
    get: (state, getters) => pickupId => {
      return getters.enrich(state.entries[pickupId])
    },
    current: (state, getters) => {
      return getters.enrich(state.entries[state.currentId])
    },
    enrich: (state, getters, rootState, rootGetters) => offer => {
      if (!offer) return
      return {
        ...offer,
        user: rootGetters['users/get'](offer.user),
        ...metaStatusesWithId(getters, ['save'], offer.id),
      }
    },
    all: (state, getters) => {
      return Object.values(state.entries)
        .map(getters.enrich)
    },
  },
  actions: {
    ...withMeta({
      async fetchList ({ dispatch, commit }) {
        // TODO: add the filters in
        const offerList = await dispatch('pagination/extractCursor', offers.list({}))
        commit('update', offerList)
        const users = offerList.map(offer => offer.user)
        commit('users/update', users, { root: true })
      },
    }),
    refresh ({ dispatch }) {
      dispatch('fetchList')
    },
    clear ({ commit }) {
      commit('clear')
    },
    ...withMeta({
      async create ({ rootGetters, dispatch, commit }, data) {
        const newOffer = await offers.create({
          ...data,
          group: rootGetters['currentGroup/id'],
        })
        commit('update', [newOffer])
        router.push({
          name: 'offerDetail',
          params: {
            groupId: newOffer.group,
            offerId: newOffer.id,
          },
        }).catch(() => {})
      },

      async select ({ commit }, { offerId }) {
        commit('update', [await offers.get(offerId)])
      },
    }, {
      setCurrentId: ({ commit }, { offerId }) => commit('setCurrentOffer', offerId),
      getCurrentId: ({ state }) => state.currentId,
      findId: ({ offerId }) => offerId,
    }),
  },
  mutations: {
    clear (state) {
      Object.assign(state, initialState())
    },
    update (state, offers) {
      for (const offer of offers) {
        Vue.set(state.entries, offer.id, offer)
      }
    },
    delete (state, id) {
      if (state.entries[id]) Vue.delete(state.entries, id)
    },
    setCurrentOffer (state, id) {
      state.currentId = id
    },
  },
}
