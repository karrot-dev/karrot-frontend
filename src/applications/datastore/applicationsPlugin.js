export default datastore => {
  datastore.watch(state => state.currentGroup.id, currentGroupId => {
    if (!currentGroupId) return
    const pendingRoute = datastore.state.routeMeta.next
    if (pendingRoute && pendingRoute.name === 'applications') {
      // applications route loads their own data, no need to load twice
      return
    }
    datastore.dispatch('applications/fetchPendingByGroupId', { groupId: currentGroupId }, { root: true })
  }, { immediate: true })

  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('applications/clear')
    }
  })
}
