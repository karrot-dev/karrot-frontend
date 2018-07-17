export default {
  namespaced: true,
  actions: {
    async refresh ({ dispatch }, done) {
      await Promise.all([
        dispatch('users/refresh', {}, { root: true }),
        dispatch('stores/refresh', null, { root: true }),
        dispatch('pickups/refresh', null, { root: true }),
        dispatch('pickupSeries/refresh', null, { root: true }),
        dispatch('invitations/refresh', null, { root: true }),
        dispatch('history/refresh', null, { root: true }),
        dispatch('groups/refresh', null, { root: true }),
        dispatch('conversations/refresh', null, { root: true }),
        dispatch('feedback/refresh', null, { root: true }),
        dispatch('currentGroup/refresh', null, { root: true }),
        dispatch('auth/refresh', null, { root: true }),
      ])
      if (done) done()
    },
  },
}
