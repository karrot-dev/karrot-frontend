export default datastore => {
  datastore.watch((state, getters) => getters['groups/mine'].map(g => g.id), (myGroups, oldMyGroups) => {
    // clear issues after leaving group
    if (!myGroups || !oldMyGroups) return
    const leftIds = oldMyGroups.filter(id => !myGroups.includes(id))
    if (leftIds.length > 0) {
      leftIds.forEach(id => datastore.commit('issues/clearForGroup', id))
    }
  }, { immediate: true })

  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    // clear issues after logging out
    if (!isLoggedIn) {
      datastore.commit('issues/clear')
    }
  })
}
