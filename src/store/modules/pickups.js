import Vue from 'vue'
import pickups from '@/services/api/pickups'
import { indexById, createMetaModule, withMeta, isValidationError, withPrefixedIdMeta, metaStatusesWithId, metaStatuses } from '@/store/helpers'

function initialState () {
  return {
    entries: {},
    idList: [],
    idListGroupId: null,
    storeIdFilter: null,
    feedbackPossibleIds: [],
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => pickupId => {
      return getters.enrich(state.entries[pickupId])
    },
    enrich: (state, getters, rootState, rootGetters) => pickup => {
      const userId = rootGetters['auth/userId']
      return pickup && {
        ...pickup,
        isUserMember: pickup.collectorIds.includes(userId),
        isEmpty: pickup.collectorIds.length === 0,
        isFull: pickup.maxCollectors > 0 && pickup.collectorIds.length >= pickup.maxCollectors,
        store: rootGetters['stores/get'](pickup.store),
        collectors: pickup.collectorIds.map(rootGetters['users/get']),
        ...metaStatusesWithId(getters, ['save', 'join', 'leave'], pickup.id),
      }
    },
    all: (state, getters, rootState, rootGetters) => {
      return state.idList.map(getters.get)
    },
    filtered: (state, getters) => {
      return getters.all.filter(e => !state.storeIdFilter || (e.store && e.store.id === state.storeIdFilter))
    },
    filteredOneTime: (state, getters) => {
      return getters.filtered.filter(e => !e.series)
    },
    joined: (state, getters) => getters.all.filter(e => e.isUserMember),
    available: (state, getters) =>
      getters.all
        .filter(isWithinOneWeek)
        .filter(e => !e.isFull)
        .filter(e => !e.isUserMember),
    mine: (state, getters, rootState, rootGetters) => {
      if (!rootGetters['auth/isLoggedIn']) return []
      return getters.all.filter(e => e.collectorIds.includes(rootGetters['auth/userId']))
    },
    feedbackPossible: (state, getters) => state.feedbackPossibleIds.map(getters.get), // TODO filter by current group id
    ...metaStatuses(['create']),
  },
  actions: {
    ...withMeta({

      async fetch ({ commit }, pickupId) {
        commit('update', await pickups.get(pickupId))
      },

      async fetchList ({ commit }) {
        // TODO implement pagination
        commit('set', { pickups: (await pickups.list()).results })
      },

      async join ({ commit, dispatch, rootGetters }, pickupId) {
        try {
          await pickups.join(pickupId)
          commit('join', { pickupId, userId: rootGetters['auth/userId'] })
        }
        catch (error) {
          if (isValidationError(error)) dispatch('fetch', { pickupId })
          throw error
        }
      },

      async leave ({ commit, dispatch, rootGetters }, pickupId) {
        try {
          await pickups.leave(pickupId)
          commit('leave', { pickupId, userId: rootGetters['auth/userId'] })
        }
        catch (error) {
          if (isValidationError(error)) dispatch('fetch', { pickupId })
          throw error
        }
      },

      async save ({ commit, dispatch }, pickup) {
        commit('update', await pickups.save(pickup))
      },

      async create ({ commit, dispatch }, data) {
        await pickups.create(data)
        dispatch('refresh')
      },

      async destroy ({ commit, dispatch }, id) {
        await pickups.delete(id)
        dispatch('refresh')
      },

      async fetchFeedbackPossible ({ commit }, groupId) {
        commit('setFeedbackPossible', (await pickups.listFeedbackPossible(groupId)).results)
      },

    }),

    ...withPrefixedIdMeta('group/', {

      async fetchListByGroupId ({ commit }, groupId) {
        commit('set', { pickups: (await pickups.listByGroupId(groupId)).results, groupId })
      },

    }),

    async maybeFetch ({ getters, dispatch }, pickupId) {
      if (!getters.get(pickupId)) {
        await dispatch('fetch', pickupId)
      }
    },

    clear ({ commit }) {
      commit('clear')
    },

    clearStoreFilter ({ commit }) {
      commit('clearStoreIdFilter')
    },

    setStoreFilter ({ commit }, storeId) {
      commit('setStoreIdFilter', storeId)
    },

    refresh ({ state, dispatch }) {
      if (state.idListGroupId) {
        dispatch('fetchListByGroupId', state.idListGroupId)
      }
      else {
        dispatch('fetchList')
      }
    },

  },
  mutations: {
    setStoreIdFilter (state, storeId) {
      state.storeIdFilter = parseInt(storeId)
    },
    clearStoreIdFilter (state) {
      state.storeIdFilter = null
    },
    clear (state) {
      Object.entries(initialState())
        .forEach(([prop, value]) => Vue.set(state, prop, value))
    },
    update (state, pickup) {
      Vue.set(state.entries, pickup.id, pickup)
    },
    set (state, { pickups, groupId }) {
      // TODO clear if necessary
      state.entries = {
        ...state.entries,
        ...indexById(pickups),
      }
      state.idList = pickups.map(e => e.id)
      state.idListGroupId = groupId
    },
    join (state, { pickupId, userId }) {
      state.entries[pickupId].collectorIds.push(userId)
    },
    leave (state, { pickupId, userId }) {
      let { collectorIds } = state.entries[pickupId]
      let idx = collectorIds.indexOf(userId)
      if (idx !== -1) collectorIds.splice(idx, 1)
    },

    setFeedbackPossible (state, pickups) {
      state.entries = {
        ...state.entries,
        ...indexById(pickups),
      }
      state.feedbackPossibleIds = pickups.map(e => e.id)
    },

  },
}

export function isWithinOneWeek (pickup) {
  return pickup.date < new Date(+new Date() + 6096e5)
}
