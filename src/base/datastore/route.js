/**
 * Extend vuex-router-sync
 * https://github.com/vuejs/vuex-router-sync
 * Joins the `route` namespace
 */

export default {
  namespaced: true,
  getters: {
    params: state => state.params,
    query: state => state.query,
    code: state => state.query.code,
    isGroupPage: state => Boolean(state.params.groupId),
    disableDesktopSideNav: state => state.meta.disableDesktopSideNav,
  },
}
