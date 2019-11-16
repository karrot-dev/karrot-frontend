import Vue from 'vue'
import offers from '@/offers/api/offers'
import { createMetaModule, withMeta, metaStatusesWithId, createPaginationModule } from '@/utils/datastore/helpers'
import router from '@/base/router'

function initialState () {
  return {
    entries: {},
    filter: {
      status: 'active',
    },
  }
}

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
    enrich: (state, getters, rootState, rootGetters) => offer => {
      if (!offer) return
      return {
        ...offer,
        canEdit: rootGetters['auth/userId'] === offer.user,
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
      async fetchList ({ state, dispatch, commit }, { status = 'active' }) {
        commit('setFilter', { status })
        const offerList = await dispatch('pagination/extractCursor', offers.list(state.filter))
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

      async save ({ dispatch, commit }, data) {
        const updatedOffer = await offers.save(data)
        commit('update', [updatedOffer])
        router.push({
          name: 'offerDetail',
          params: {
            groupId: updatedOffer.group,
            offerId: updatedOffer.id,
          },
        }).catch(() => {})
      },

      async accept ({ state, commit }, { offerId }) {
        const updatedOffer = await offers.accept(offerId)
        commit('update', [updatedOffer])
      },

      async archive ({ state, commit }, { offerId }) {
        const updatedOffer = await offers.archive(offerId)
        commit('update', [updatedOffer])
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
    setFilter (state, data) {
      state.entries = {}
      state.filter = data
    },
  },
}
