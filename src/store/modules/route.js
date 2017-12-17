/**
 * Extend vuex-router-sync with getters
 * Joins the `route` namespace
 */

export default {
  namespaced: true,
  getters: {
    params: state => state.params,
    query: state => state.query,
  },
}
