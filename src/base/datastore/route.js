// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT

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
    disableDesktopSidenav: state => state.meta.disableDesktopSidenav,
  },
}
