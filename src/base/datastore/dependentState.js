export default datastore => {
  // TODO move into places/datastore

  // // If our groups change, then available places may change, so refresh them
  // const updatePlaceList = () => {
  //   if (!datastore.getters['auth/isLoggedIn']) return
  //   datastore.dispatch('places/fetch', null, { root: true })
  // }
  // const groupIdsGetter = () => datastore.getters['groups/mineWithApplications'].map(group => group.id).sort().join(',')
  // datastore.watch(groupIdsGetter, updatePlaceList)
}
