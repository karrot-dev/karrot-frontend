export default store => {
  // When our groups list changes, our available users may change, so we refresh them
  const updateUserList = () => store.dispatch('users/fetchList', null, { root: true })
  const groupIdsGetter = () => store.getters['groups/all'].map(group => group.id).sort()
  store.watch(groupIdsGetter, updateUserList)
}
