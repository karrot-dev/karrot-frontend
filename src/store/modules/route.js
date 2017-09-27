/**
 * Extend vuex-router-sync with getters
 * Joins the `route` namespace
 */

export const getters = {
  params: state => state.params,
  query: state => state.query,
}
