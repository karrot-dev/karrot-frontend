// SPDX-FileCopyrightText: 2016-2022 2016 Nick Sellen, <hello@nicksellen.co.uk> et al.
//
// SPDX-License-Identifier: MIT


export default ({ user }) => ({
  breadcrumbs: {
    namespaced: true,
    mutations: {
      set: jest.fn(),
    },
  },
  auth: {
    namespaced: true,
    getters: {
      user: jest.fn(() => user),
      userId: (state, getters) => getters.user && getters.user.id,
      isLoggedIn: (state, getters) => Boolean(getters.user),
    },
  },
  routeError: {
    namespaced: true,
    actions: {
      set: jest.fn(),
      clear: jest.fn(),
    },
  },
  currentGroup: {
    namespaced: true,
    actions: {
      markUserActive: jest.fn(),
    },
  },
  applications: {
    namespaced: true,
    getters: {
      groupHasMyApplication: () => () => null,
      getForActivePreview: () => null,
    },
    actions: {
      fetchMine: jest.fn(),
    },
  },
})
