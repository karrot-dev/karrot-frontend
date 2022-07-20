export default datastore => {
  datastore.watch(state => state.currentGroup.id, currentGroupId => {
    if (!currentGroupId) return
    console.log('NOT fetching activities any more!')
    // datastore.dispatch('activities/fetchListByGroupId', currentGroupId, { root: true })
    // datastore.dispatch('activities/fetchFeedbackPossible', currentGroupId, { root: true })
  }, { immediate: true })

  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('activities/clear')
    }
  })
}
