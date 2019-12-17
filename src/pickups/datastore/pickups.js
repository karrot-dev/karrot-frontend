import pickups from '@/pickups/api/pickups'
import { createMetaModule, withMeta, isValidationError, withPrefixedIdMeta, metaStatusesWithId, metaStatuses, indexById } from '@/utils/datastore/helpers'
import addDays from 'date-fns/addDays'
import reactiveNow from '@/utils/reactiveNow'

function initialState () {
  return {
    entries: {},
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
      const place = rootGetters['places/get'](pickup.place)
      const group = place && place.group
      return {
        ...pickup,
        isUserMember: pickup.collectors.includes(userId),
        isEmpty: pickup.collectors.length === 0,
        isFull: pickup.maxCollectors > 0 && pickup.collectors.length >= pickup.maxCollectors,
        place,
        group,
        collectors: pickup.collectors.map(rootGetters['users/get']),
        feedbackGivenBy: pickup.feedbackGivenBy ? pickup.feedbackGivenBy.map(rootGetters['users/get']) : [],
        hasStarted: pickup.date <= reactiveNow.value && pickup.dateEnd > reactiveNow.value,
        ...metaStatusesWithId(getters, ['save', 'join', 'leave'], pickup.id),
      }
    },
    upcomingAndStarted: (state, getters) => {
      return Object.values(state.entries)
        .map(getters.enrich)
        .filter(p => p.dateEnd > reactiveNow.value)
        .filter(p => !p.hasStarted || p.isUserMember)
        .sort(sortByDate)
    },
    byCurrentGroup: (state, getters) => {
      return getters.upcomingAndStarted.filter(({ group }) => group && group.isCurrentGroup)
    },
    byActivePlace: (state, getters) => {
      return getters.byCurrentGroup.filter(({ place }) => place && place.isActivePlace)
    },
    joined: (state, getters) => getters.byCurrentGroup.filter(e => e.isUserMember),
    available: (state, getters) =>
      getters.byCurrentGroup
        .filter(isWithinOneWeek)
        .filter(e => !e.isFull && !e.isUserMember && !e.isDisabled)
        .filter(e => e.place.isSubscribed),
    feedbackPossibleByCurrentGroup: (state, getters) => {
      return Object.values(state.entries)
        .filter(p => p.dateEnd < reactiveNow.value && p.feedbackDue > reactiveNow.value)
        .map(getters.enrich)
        .filter(p => p.isUserMember)
        .filter(p => p.group && p.group.isCurrentGroup)
        .filter(p => !p.feedbackGivenBy.find(u => u.isCurrentUser))
        .sort(sortByDate)
    },
    feedbackPossibleByActivePlace: (state, getters) =>
      getters.feedbackPossibleByCurrentGroup
        .filter(({ place }) => place && place.isActivePlace),
    ...metaStatuses(['create', 'fetchFeedbackPossible']),
    fetchingForCurrentGroup: (state, getters, rootState, rootGetters) => {
      const currentGroupId = rootState.currentGroup.id
      if (!currentGroupId) return false
      const status = getters['meta/status']('fetchListByGroupId', `group/${currentGroupId}`)
      return status.pending
    },
  },
  actions: {
    ...withMeta({
      async fetch ({ commit }, pickupId) {
        commit('update', [await pickups.get(pickupId)])
      },
      async join ({ dispatch }, pickupId) {
        try {
          await pickups.join(pickupId)
        }
        catch (error) {
          if (isValidationError(error)) dispatch('fetch', pickupId)
          throw error
        }
      },
      async leave ({ dispatch }, pickupId) {
        try {
          await pickups.leave(pickupId)
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
    }),
    ...withMeta({
      async fetchFeedbackPossible ({ commit }, groupId) {
        commit('update', (await pickups.listFeedbackPossible(groupId)).results)
      },
    }, {
      findId: () => null,
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
    clear (state) {
      Object.assign(state, initialState())
    },
    clearUpcomingForPlace (state, placeId) {
      const now = new Date()
      const rest = Object.fromEntries(Object.entries(state.entries)
        .filter(pickup => !(pickup.place === placeId && pickup.date >= now)))
      Object.freeze(rest)
      state.entries = rest
    },
    update (state, pickups) {
      state.entries = Object.freeze({ ...state.entries, ...indexById(pickups) })
    },
    delete (state, pickupId) {
      if (state.entries[pickupId]) {
        const { [pickupId]: _, ...rest } = state.entries
        Object.freeze(rest)
        state.entries = rest
      }
    },
  },
}

export function isWithinOneWeek (pickup) {
  return pickup.date < addDays(reactiveNow.value, 7)
}

export function sortByDate (a, b) {
  return a.date - b.date
}
