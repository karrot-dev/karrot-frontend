// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

export default datastore => {
  // TODO move into places/datastore

  // If our groups change, then available places may change, so refresh them
  const updatePlaceList = () => {
    if (!datastore.getters['auth/isLoggedIn']) return
    datastore.dispatch('places/fetch', null, { root: true })
  }
  const groupIdsGetter = () => datastore.getters['groups/mineWithApplications'].map(group => group.id).sort().join(',')
  datastore.watch(groupIdsGetter, updatePlaceList)
}
