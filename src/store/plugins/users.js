export default store => {
  // When our groups list changes, our available users may change, so we refresh them
  const updateUserList = () => store.dispatch('users/fetchList', null, { root: true })
  const memberIdsGetter = () => store.getters['groups/myGroupMemberIds'].join(',')
  store.watch(memberIdsGetter, updateUserList)
}
