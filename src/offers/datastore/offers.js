import Vue from 'vue'
import offers from '@/offers/api/offers'
import {
  createMetaModule,
  withMeta,
  metaStatusesWithId,
  createPaginationModule,
  metaStatuses,
} from '@/utils/datastore/helpers'
import router from '@/base/router'

const DEFAULT_STATUS = 'active'

function initialState () {
  return {
    entries: {},
    filter: {
      status: DEFAULT_STATUS,
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
    ...metaStatuses(['create']),
    get: (state, getters) => offerId => {
      return getters.enrich(state.entries[offerId])
    },
    enrich: (state, getters, rootState, rootGetters) => offer => {
      if (!offer) return
      return {
        ...offer,
        canEdit: rootGetters['auth/userId'] === offer.user,
        user: rootGetters['users/get'](offer.user),
        group: rootGetters['groups/get'](offer.group),
        ...metaStatusesWithId(getters, ['save'], offer.id),
      }
    },
    all: (state, getters) => {
      return Object.values(state.entries)
        .map(getters.enrich)
    },
    routeQuery: ({ filter: { status } }) => status === DEFAULT_STATUS ? {} : { status },
    fetching: (state, getters) => {
      const status = getters['meta/status']('fetchList')
      return status.pending
    },
  },
  actions: {
    ...withMeta({
      async fetchList ({ state, rootGetters, dispatch, commit }, { status = 'active' }) {
        commit('setFilter', { status })
        const group = rootGetters['currentGroup/id']
        const offerList = await dispatch('pagination/extractCursor', offers.list({ ...state.filter, group }))
        commit('update', offerList)
      },
    }),
    refresh ({ state, dispatch }) {
      dispatch('fetchList', state.filter)
    },
    clear ({ commit }) {
      commit('clear')
    },
    ...withMeta({
      async create ({ getters, rootGetters, dispatch, commit }, data) {
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
          query: getters.routeQuery,
        }).catch(() => {})
      },

      async save ({ getters, state, dispatch, commit }, data) {
        const updatedOffer = await offers.save(data)
        commit('update', [updatedOffer])
        commit('currentOffer/update', updatedOffer, { root: true })
        router.push({
          name: 'offerDetail',
          params: {
            groupId: updatedOffer.group,
            offerId: updatedOffer.id,
          },
          query: getters.routeQuery,
        }).catch(() => {})
      },
    }),

    ...withMeta({
      async accept ({ state, commit, dispatch }, { offerId }) {
        const updatedOffer = await offers.accept(offerId)
        commit('update', [updatedOffer])
        commit('currentOffer/update', updatedOffer, { root: true })
        dispatch('refresh')
      },

      async archive ({ state, commit, dispatch }, { offerId }) {
        const updatedOffer = await offers.archive(offerId)
        commit('update', [updatedOffer])
        commit('currentOffer/update', updatedOffer, { root: true })
        dispatch('refresh')
      },
    }, {
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
