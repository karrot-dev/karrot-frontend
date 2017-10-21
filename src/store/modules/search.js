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
  terms: state => state.terms,
  results: (state, getters, rootState, rootGetters) => {
    const stores = rootGetters['stores/all'],
      groups = rootGetters['groups/all'],
      users = rootGetters['users/all']
    const res = []

    let storeRes = stores.filter((store) => store.name.toLowerCase().match(getters.terms.toLowerCase()))
    res.push(...storeRes.map(e => ({
      value: {name: 'store', params: {groupId: e.groupId, storeId: e.id}},
      label: e.name,
      icon: 'fa-shopping-cart',
    })))

    let groupRes = groups.filter((group) => group.name.toLowerCase().match(getters.terms.toLowerCase()))
    res.push(...groupRes.map(e => ({
      value: {name: 'group', params: {groupId: e.id}},
      label: e.name,
      icon: 'fa-home',
    })))

    let userRes = users.filter((user) => user.displayName.toLowerCase().match(getters.terms.toLowerCase()))
    res.push(...userRes.map(e => ({
      value: {name: 'user', params: {userId: e.id}},
      label: e.displayName,
      icon: 'fa-user',
    })))

    return res
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
