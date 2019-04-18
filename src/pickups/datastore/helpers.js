import Vue from 'vue'
import { createMetaModule, withMeta, isValidationError, withPrefixedIdMeta, metaStatusesWithId, metaStatuses } from '@/utils/datastore/helpers'
import addDays from 'date-fns/add_days'
import reactiveNow from '@/utils/reactiveNow'

export function isWithinOneWeek (entry) {
  return entry.date < addDays(reactiveNow.value, 7)
}

export function sortByDate (a, b) {
  return a.date - b.date
}

export function createEventModule ({ api }) {
  function initialState () {
    return {
      entries: {},
    }
  }

  return {
    namespaced: true,
    modules: { meta: createMetaModule() },
    state: initialState(),
    getters: {
      get: (state, getters, rootState, rootGetters) => id => {
        return getters.enrich(state.entries[id])
      },
      enrich: (state, getters, rootState, rootGetters) => entry => {
        if (!entry) return
        const userId = rootGetters['auth/userId']
        const place = rootGetters['places/get'](entry.place)
        const group = place && place.group
        return {
          ...entry,
          isUserMember: entry.collectors.includes(userId),
          isEmpty: entry.collectors.length === 0,
          isFull: entry.maxCollectors > 0 && entry.collectors.length >= entry.maxCollectors,
          place,
          group,
          collectors: entry.collectors.map(rootGetters['users/get']),
          hasStarted: entry.date <= reactiveNow.value && entry.dateEnd > reactiveNow.value,
          ...metaStatusesWithId(getters, ['save', 'join', 'leave'], entry.id),
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
      fetchingForCurrentGroup: (state, getters, rootState, rootGetters) => {
        const currentGroupId = rootState.currentGroup.id
        if (!currentGroupId) return false
        const status = getters['meta/status']('fetchListByGroupId', `group/${currentGroupId}`)
        return status.pending
      },
      ...metaStatuses(['create']),
    },
    actions: {
      ...withMeta({
        async fetch ({ commit }, id) {
          commit('update', [await api.get(id)])
        },
        async join ({ commit, dispatch, rootGetters }, id) {
          try {
            await api.join(id)
            commit('join', { id, userId: rootGetters['auth/userId'] })
          }
          catch (error) {
            if (isValidationError(error)) dispatch('fetch', id)
            throw error
          }
        },
        async leave ({ commit, dispatch, rootGetters }, id) {
          try {
            await api.leave(id)
            commit('leave', { id, userId: rootGetters['auth/userId'] })
          }
          catch (error) {
            if (isValidationError(error)) dispatch('fetch', id)
            throw error
          }
        },
        async save ({ commit, dispatch }, entry) {
          commit('update', [await api.save(entry)])
        },
        async create ({ commit, dispatch }, data) {
          await api.create(data)
          dispatch('refresh')
        },
        async destroy ({ commit, dispatch }, id) {
          await api.delete(id)
          dispatch('refresh')
        },
      }),

      ...withPrefixedIdMeta('group/', {
        async fetchListByGroupId ({ commit }, groupId) {
          commit('update', (await api.listByGroupId(groupId)).results)
        },
      }),

      async maybeFetch ({ state, getters, dispatch }, id) {
        const isPending = getters['meta/status']('fetch', id).pending
        if (!state.entries[id] && !isPending) {
          await dispatch('fetch', id)
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
        Object.values(state.entries)
          .filter(entry => entry.place === placeId && entry.date >= now)
          .forEach(entry => Vue.delete(state.entries, entry.id))
      },
      update (state, entries) {
        for (const entry of entries) {
          Vue.set(state.entries, entry.id, entry)
        }
      },
      delete (state, id) {
        if (state.entries[id]) Vue.delete(state.entries, id)
      },
      join (state, { id, userId }) {
        const { collectors } = state.entries[id]
        if (collectors.includes(userId)) return
        collectors.push(userId)
      },
      leave (state, { id, userId }) {
        const { collectors } = state.entries[id]
        const idx = collectors.indexOf(userId)
        if (idx !== -1) collectors.splice(idx, 1)
      },
    },
  }
}
