/**
 * Extend vuex-router-sync with getters
 * Joins the `route` namespace
 */

export default {
  namespaced: true,
  getters: {
    params: state => state.params,
    query: state => state.query,
    code: state => state.query.code,
    isGroupPage: state => Boolean(state.params.groupId),
    disableDesktopSidenav: state => state.meta.disableDesktopSidenav,
  },
}
