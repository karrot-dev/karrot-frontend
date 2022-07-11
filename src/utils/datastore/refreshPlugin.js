// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

export default datastore => {
  datastore.watch((state, getters) => ([
    getters['routeMeta/pending'],
    state.refresh.requested,
  ]), ([routePending, refreshRequested]) => {
    if (!routePending && refreshRequested) {
      datastore.dispatch('refresh/maybeRefresh')
    }
  })
}
