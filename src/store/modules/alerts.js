import Vue from 'vue'

export const types = {
  CREATE: 'Create',
  DISMISS: 'Dismiss',
  CLEAR: 'Clear',
}

export const state = {
  entries: {},
  idList: [],
  counter: 0,
}

export const getters = {
  list: state => state.idList.map(i => state.entries[i]),
}

export const actions = {
  create ({ commit }, alert) {
    return commit(types.CREATE, { alert })
  },

  dismiss ({ commit }, id) {
    commit(types.DISMISS, { id })
  },

  clear ({ commit }) {
    commit(types.CLEAR)
  },
}

export const mutations = {
  [types.CREATE] (state, { alert }) {
    state.counter++
    alert.id = state.counter
    Vue.set(state.entries, alert.id, alert)
    state.idList.push(alert.id)
    return alert.id
  },

  [types.DISMISS] (state, { id }) {
    Vue.delete(state.entries, id)
    state.idList.splice(state.idList.indexOf(id), 1)
  },

  [types.CLEAR] (state) {
    state.entries = {}
    state.idList = []
    // don't reset counter, maybe there are still old references around
  },
}
