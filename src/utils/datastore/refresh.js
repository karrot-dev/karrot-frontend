export default {
  namespaced: true,
  actions: {
    async refresh ({ dispatch, rootGetters }, done) {
      const activeState = {
        groupId: rootGetters['currentGroup/id'],
        storeId: rootGetters['stores/activeStoreId'],
        userId: rootGetters['user/activeUserId'],
      }
      await Promise.all([
        dispatch('users/refresh', {}, { root: true }),
        dispatch('stores/refresh', null, { root: true }),
        dispatch('pickups/refresh', null, { root: true }),
        dispatch('pickupSeries/refresh', null, { root: true }),
        dispatch('invitations/refresh', null, { root: true }),
        dispatch('history/fetch', activeState, { root: true }),
        dispatch('groups/refresh', null, { root: true }),
        dispatch('conversations/refresh', null, { root: true }),
        dispatch('feedback/fetch', activeState, { root: true }),
        dispatch('currentGroup/refresh', null, { root: true }),
        dispatch('currentThread/refresh', null, { root: true }),
        dispatch('auth/refresh', null, { root: true }),
        dispatch('latestMessages/refresh', null, { root: true }),
        dispatch('notifications/refresh', null, { root: true }),
      ])
      if (done) done()
    },
  },
}
