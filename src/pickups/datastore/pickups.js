import Vue from 'vue'
import pickups from '@/pickups/api/pickups'
import { createMetaModule, withMeta, isValidationError, withPrefixedIdMeta, metaStatusesWithId, metaStatuses } from '@/utils/datastore/helpers'
import subMinutes from 'date-fns/sub_minutes'

function initialState () {
  return {
    now: new Date(), // reactive current time
    entries: {
      234: {
        'id': 234,
        'date': subMinutes(new Date(), 5),
        'store': 130,
        'maxCollectors': 4,
        'collectorIds': [1, 2, 422],
        'description': 'you can join this pickup',
      },
    },
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
        feedbackGivenBy: pickup.feedbackGivenBy ? pickup.feedbackGivenBy.map(rootGetters['users/get']) : [],
        hasStarted: pickup.date <= new Date(),
        ...metaStatusesWithId(getters, ['save', 'join', 'leave'], pickup.id),
      }
    },
    upcoming: (state, getters) => {
      return Object.values(state.entries)
        .filter(p => p.date >= subMinutes(state.now, 30))
        .map(getters.enrich)
        .filter(p => p.date >= state.now || (p.isUserMember && p.date <= state.now))
        .sort(sortByDate)
    },
    byCurrentGroup: (state, getters) => {
      return getters.upcoming.filter(({ group }) => group && group.isCurrentGroup)
    },
    byActiveStore: (state, getters) => {
      return getters.byCurrentGroup.filter(({ store }) => store && store.isActiveStore)
    },
    byActiveStoreOneTime: (state, getters) => {
      return getters.byActiveStore.filter(e => !e.series)
    },
    joined: (state, getters) => getters.byCurrentGroup.filter(e => e.isUserMember),
    available: (state, getters) =>
      getters.byCurrentGroup
        .filter(isWithinOneWeek)
        .filter(e => !e.isFull && !e.isUserMember && !e.isDisabled),
    feedbackPossibleByCurrentGroup: (state, getters) => {
      return Object.values(state.entries)
        .filter(p => p.date < state.now && p.feedbackDue > state.now)
        .map(getters.enrich)
        .filter(p => p.isUserMember)
        .filter(p => p.group && p.group.isCurrentGroup)
        .filter(p => !p.feedbackGivenBy.find(u => u.isCurrentUser))
        .sort(sortByDate)
    },
    feedbackPossibleByActiveStore: (state, getters) =>
      getters.feedbackPossibleByCurrentGroup
        .filter(({ store }) => store && store.isActiveStore),
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
        commit('update', (await pickups.listFeedbackPossible(groupId)).results)
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
      Object.assign(state, initialState())
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
  },
}

export function isWithinOneWeek (pickup) {
  return pickup.date < new Date(+new Date() + 6096e5)
}

export function sortByDate (a, b) {
  return a.date - b.date
}

export function plugin (datastore) {
  // keep state.now update to date
  setInterval(() => datastore.commit('pickups/updateNow'), 60 * 1000)
}
