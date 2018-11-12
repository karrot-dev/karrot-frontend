export default datastore => {
  // TODO split up and move into users/datastore and stores/datastore

  // If any change to our group members then available users may change, so refresh them
  const updateUserList = () => datastore.dispatch('users/fetch', null, { root: true })
  const memberIdsGetter = () => datastore.getters['groups/myMemberIds'].join(',')
  datastore.watch(memberIdsGetter, updateUserList)

  // If our groups change, then available stores may change, so refresh them
  const updateStoreList = () => datastore.dispatch('stores/fetch', null, { root: true })
  const groupIdsGetter = () => datastore.getters['groups/mine'].map(group => group.id).sort().join(',')
  datastore.watch(groupIdsGetter, updateStoreList)
}
