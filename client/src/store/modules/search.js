function initialState () {
  return {
    open: false,
    terms: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    open: state => state.open,
    terms: state => state.terms || '',
    results: (state, getters, rootState, rootGetters) => {
      const stores = rootGetters['stores/all'],
        groups = rootGetters['groups/all'],
        users = rootGetters['users/all']

      const matches = (name) => name.toLowerCase().includes(getters.terms.toLowerCase())

      const storeRes = stores.filter((store) => matches(store.name))
      const groupRes = groups.filter((group) => matches(group.name))
      const userRes = users.filter((user) => matches(user.displayName))

      return [
        ...storeRes.map(e => ({
          value: {name: 'store', params: {groupId: e.group, storeId: e.id}},
          label: e.name,
          icon: 'fa-shopping-cart',
        })),
        ...groupRes.map(e => ({
          value: {name: 'group', params: {groupId: e.id}},
          label: e.name,
          icon: 'fa-home',
        })),
        ...userRes.map(e => ({
          value: {name: 'user', params: {userId: e.id}},
          label: e.displayName,
          icon: 'fa-user',
        })),
      ]
    },

  },
  actions: {
    show ({ commit }) {
      commit('show')
    },

    hide ({ commit }) {
      commit('hide')
    },
    hideIfEmpty ({ commit, getters }) {
      if (!getters.terms) {
        commit('hide')
      }
    },

    setTerms ({ commit }, terms) {
      commit('setTerms', terms)
    },

  },
  mutations: {
    show (state) {
      state.open = true
    },
    hide (state) {
      state.open = false
    },
    setTerms (state, terms) {
      state.terms = terms
    },
  },
}
