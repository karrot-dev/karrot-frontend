// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

export default datastore => {
  datastore.watch(state => state.currentGroup.id, currentGroupId => {
    if (!currentGroupId) return
    datastore.dispatch('activities/fetchListByGroupId', currentGroupId, { root: true })
    datastore.dispatch('activities/fetchFeedbackPossible', currentGroupId, { root: true })
  }, { immediate: true })

  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('activities/clear')
    }
  })
}
