import Vue from 'vue'
import pickups from '@/services/api/pickups'
import { indexById, createMetaModule, withMeta, isValidationError, withPrefixedIdMeta, metaStatusesWithId, metaStatuses } from '@/store/helpers'

function initialState () {
  return {
    entries: {},
    idList: [], // all upcoming pickups, in the current group
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
    feedbackPossible: (state, getters) => state.feedbackPossibleIds.map(getters.get),
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
          if (isValidationError(error)) dispatch('fetch', pickupId)
          throw error
        }
      },

      async leave ({ commit, dispatch, rootGetters }, pickupId) {
        try {
          await pickups.leave(pickupId)
          commit('leave', { pickupId, userId: rootGetters['auth/userId'] })
        }
        catch (error) {
          if (isValidationError(error)) dispatch('fetch', pickupId)
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

    update ({ state, commit, getters }, pickup) {
      // does it belong to the current group?
      const { store } = getters.enrich(pickup)
      if (store && store.group === state.idListGroupId) {
        commit('update', pickup)
      }
    },

    delete ({ commit }, pickupId) {
      commit('delete', pickupId)
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

    addFeedbackPossible ({ state, commit, getters }, pickup) {
      // does it belong to the current group?
      const store = getters.enrich(pickup).store
      if (store.group === state.idListGroupId) {
        commit('setFeedbackPossible', [pickup])
      }
    },
    removeFeedbackPossible ({ state, commit }, pickupId) {
      if (state.feedbackPossibleIds.includes(pickupId)) {
        commit('removeFeedbackPossible', pickupId)
      }
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

      // only add to idList if upcoming and not already in list
      const now = new Date()
      const idList = state.idList
      const entries = state.entries
      if (pickup.date > now && !idList.includes(pickup.id)) {
        let i = 0
        while (i < idList.length && entries[idList[i]].date < pickup.date) i++
        idList.splice(i, 0, pickup.id)
      }
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
    delete (state, pickupId) {
      const idx = state.idList.indexOf(pickupId)
      if (idx !== -1) state.idList.splice(idx, 1)
      if (state.entries[pickupId]) Vue.delete(state.entries, pickupId)
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
      state.feedbackPossibleIds = [
        ...state.feedbackPossibleIds,
        ...pickups.map(e => e.id),
      ]
    },
    removeFeedbackPossible (state, pickupId) {
      const pickups = state.feedbackPossibleIds
      const idx = pickups.indexOf(pickupId)
      if (idx !== -1) pickups.splice(idx, 1)
    },

  },
}

export function isWithinOneWeek (pickup) {
  return pickup.date < new Date(+new Date() + 6096e5)
}

// export function sortByDate (a, b) {
//   if (a.date > b.date) { return a }
//   if (a.date < b.date) { return b }
//   return 0
// }
