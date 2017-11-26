export const types = {
  SHOW: 'Show',
  HIDE: 'Hide',
  SET_TERMS: 'Set Terms',
}

function initialState () {
  return {
    open: false,
    terms: null,
  }
}

export const state = initialState()

export const getters = {
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
}

export const actions = {
  show ({ commit }) {
    commit(types.SHOW)
  },

  hide ({ commit }) {
    commit(types.HIDE)
  },
  hideIfEmpty ({ commit, getters }) {
    if (!getters.terms) {
      commit(types.HIDE)
    }
  },

  setTerms ({ commit }, terms) {
    commit(types.SET_TERMS, { terms })
  },
}

export const mutations = {
  [types.SHOW] (state) {
    state.open = true
  },
  [types.HIDE] (state) {
    state.open = false
  },
  [types.SET_TERMS] (state, { terms }) {
    state.terms = terms
  },
}
