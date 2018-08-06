export default ({ user }) => ({
  breadcrumbs: {
    namespaced: true,
    actions: {
      setAll: jest.fn(),
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
  groupApplications: {
    namespaced: true,
    getters: {
      getByGroupId: () => () => null,
    },
    actions: {
      fetchMine: jest.fn(),
    },
  },
})
