export default datastore => {
  datastore.watch(state => state.currentGroup.id, currentGroupId => {
    if (!currentGroupId) return
    datastore.dispatch('pickups/fetchListByGroupId', currentGroupId, { root: true })
    datastore.dispatch('pickups/fetchFeedbackPossible', currentGroupId, { root: true })
  }, { immediate: true })

  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('pickups/clear')
    }
  })
}
