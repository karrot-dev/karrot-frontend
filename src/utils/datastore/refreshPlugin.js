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
