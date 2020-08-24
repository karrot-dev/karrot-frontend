import { createMetaModule, withMeta, metaStatuses } from '@/utils/datastore/helpers'

function initialState () {
  return {
    requested: false,
    lastRefresh: new Date(),
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    ...metaStatuses(['refresh']),
  },
  actions: {
    ...withMeta({
      async refresh ({ commit, dispatch, rootGetters }, done) {
        // check if we are still logged in, otherwise further requests might just return HTTP4xx
        await dispatch('auth/refresh', null, { root: true })

        if (!rootGetters['auth/isLoggedIn']) {
          // we are not logged in (anymore), can only refresh groups
          dispatch('groups/fetch', null, { root: true })
          return
        }

        const activeState = {
          groupId: rootGetters['currentGroup/id'],
          placeId: rootGetters['places/activePlaceId'],
          userId: rootGetters['user/activeUserId'],
        }
        await Promise.all([
          dispatch('users/refresh', {}, { root: true }),
          dispatch('places/fetch', null, { root: true }),
          dispatch('activities/refresh', null, { root: true }),
          dispatch('activitySeries/fetchListForActivePlace', null, { root: true }),
          dispatch('invitations/refresh', null, { root: true }),
          dispatch('history/fetch', activeState, { root: true }),
          dispatch('groups/fetch', null, { root: true }),
          dispatch('conversations/refresh', null, { root: true }),
          dispatch('feedback/fetch', activeState, { root: true }),
          dispatch('currentGroup/refresh', null, { root: true }),
          dispatch('currentThread/refresh', null, { root: true }),
          dispatch('latestMessages/fetch', {}, { root: true }),
          dispatch('notifications/fetch', null, { root: true }),
          dispatch('status/refresh', null, { root: true }),
        ])
        commit('setLastRefresh')
        if (done) done()
      },
    }),

    maybeRefresh ({ dispatch, commit, state, getters }) {
      commit('requestRefresh', false)
      if (getters.refreshStatus.pending) return
      // wait at least 60 seconds before and between refreshing
      if (new Date() - state.lastRefresh < 1000 * 60) return
      dispatch('refresh')
    },
  },
  mutations: {
    requestRefresh (state, value) {
      state.requested = value
    },
    setLastRefresh (state) {
      state.lastRefresh = new Date()
    },
  },
}
