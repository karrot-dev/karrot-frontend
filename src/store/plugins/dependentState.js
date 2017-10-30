export default store => {
  // If any change to our group members then available users may change, so refresh them
  const updateUserList = () => store.dispatch('users/fetchList', null, { root: true })
  const memberIdsGetter = () => store.getters['groups/myGroupMemberIds'].join(',')
  store.watch(memberIdsGetter, updateUserList)

  // If our groups change, then available stores may change, so refresh them
  const updateStoreList = () => store.dispatch('stores/fetchList', null, { root: true })
  const groupIdsGetter = () => store.getters['groups/myGroups'].map(group => group.id).sort().join(',')
  store.watch(groupIdsGetter, updateStoreList)
}
