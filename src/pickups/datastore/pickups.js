import Vue from 'vue'
import pickups from '@/pickups/api/pickups'
import { indexById, createMetaModule, withMeta, isValidationError, withPrefixedIdMeta, metaStatusesWithId, metaStatuses } from '@/utils/datastore/helpers'

function initialState () {
  return {
    now: new Date(), // reactive current time
    entries: {},
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
      if (!pickup) return
      const userId = rootGetters['auth/userId']
      const store = rootGetters['stores/get'](pickup.store)
      const group = store && store.group
      return {
        ...pickup,
        isUserMember: pickup.collectorIds.includes(userId),
        isEmpty: pickup.collectorIds.length === 0,
        isFull: pickup.maxCollectors > 0 && pickup.collectorIds.length >= pickup.maxCollectors,
        store,
        group,
        collectors: pickup.collectorIds.map(rootGetters['users/get']),
        ...metaStatusesWithId(getters, ['save', 'join', 'leave'], pickup.id),
      }
    },
    all: (state, getters) => {
      return Object.values(state.entries)
        .filter(p => p.date >= state.now)
        .map(getters.enrich)
        .filter(p => p.group && p.group.isCurrentGroup)
        .sort(sortByDate)
    },
    byCurrentGroup: (state, getters) => {
      return getters.all.filter(e => e.group && e.group.isCurrentGroup)
    },
    byActiveStore: (state, getters) => {
      return getters.all.filter(e => e.store && e.store.isActiveStore)
    },
    byActiveStoreOneTime: (state, getters) => {
      return getters.byActiveStore.filter(e => !e.series)
    },
    joined: (state, getters) => getters.byCurrentGroup.filter(e => e.isUserMember),
    available: (state, getters) =>
      getters.byCurrentGroup
        .filter(isWithinOneWeek)
        .filter(e => !e.isFull)
        .filter(e => !e.isUserMember),
    feedbackPossible: (state, getters) => state.feedbackPossibleIds.map(getters.get),
    feedbackPossibleFiltered: (state, getters) =>
      state.feedbackPossibleIds
        .map(getters.get)
        .filter(p => p.group && p.group.isCurrentGroup),
    ...metaStatuses(['create']),
  },
  actions: {
    ...withMeta({
      async fetch ({ commit }, pickupId) {
        commit('update', [await pickups.get(pickupId)])
      },
      async fetchList ({ commit }) {
        // TODO implement pagination
        commit('update', (await pickups.list()).results)
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
        commit('update', [await pickups.save(pickup)])
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
        commit('update', (await pickups.listByGroupId(groupId)).results)
      },
    }),

    async maybeFetch ({ state, getters, dispatch }, pickupId) {
      const isPending = getters['meta/status']('fetch', pickupId).pending
      if (!state.entries[pickupId] && !isPending) {
        await dispatch('fetch', pickupId)
      }
    },
    clearUpcomingForStore ({ commit }, storeId) {
      commit('clearUpcomingForStore', storeId)
    },
    addFeedbackPossible ({ commit, getters, rootGetters }, pickup) {
      const { group } = getters.enrich(pickup)
      if (group && group.isCurrentGroup) {
        commit('setFeedbackPossible', [pickup])
      }
    },
    removeFeedbackPossible ({ state, commit }, pickupId) {
      if (state.feedbackPossibleIds.includes(pickupId)) {
        commit('removeFeedbackPossible', pickupId)
      }
    },
    refresh ({ dispatch, rootGetters }) {
      const groupId = rootGetters['currentGroup/id']
      if (groupId) {
        dispatch('fetchListByGroupId', groupId)
      }
    },
  },
  mutations: {
    updateNow (state) {
      state.now = new Date()
    },
    clear (state) {
      Object.entries(initialState())
        .forEach(([prop, value]) => Vue.set(state, prop, value))
    },
    clearUpcomingForStore (state, storeId) {
      const now = new Date()
      Object.values(state.entries)
        .filter(pickup => pickup.store === storeId && pickup.date >= now)
        .forEach(pickup => Vue.delete(state.entries, pickup.id))
    },
    update (state, pickups) {
      for (const pickup of pickups) {
        Vue.set(state.entries, pickup.id, pickup)
      }
    },
    delete (state, pickupId) {
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
      const pickupIds = state.feedbackPossibleIds
      const idx = pickupIds.indexOf(pickupId)
      if (idx !== -1) pickupIds.splice(idx, 1)
    },
  },
}

export function isWithinOneWeek (pickup) {
  return pickup.date < new Date(+new Date() + 6096e5)
}

export function sortByDate (a, b) {
  return a.date - b.date
}

export function plugin (store) {
  // keep state.now update to date
  setInterval(() => store.commit('pickups/updateNow'), 60 * 1000)
}
