import Vue from 'vue'

export const types = {
  CREATE: 'Create',
  DISMISS: 'Dismiss',
  CLEAR: 'Clear',
}

function initialState () {
  return {
    entries: {},
    idList: [],
  }
}

export const state = initialState()

export const getters = {
  all: (state, getters, rootState, rootGetters) => {
    // Transient alerts created via actions

    const alerts = state.idList.map(i => state.entries[i])

    // Derived state alerts

    const activeGroup = rootGetters['groups/activeGroup']
    if (activeGroup && activeGroup.awaitingAgreement) {
      alerts.push({
        type: 'awaitingAgreement',
        context: activeGroup.activeAgreement,
        dismissible: true,
      })
    }

    return alerts
  },
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

let counter = 1 // start at 1 so it is always truthy

export const mutations = {
  [types.CREATE] (state, { alert }) {
    alert.id = counter++
    Vue.set(state.entries, alert.id, alert)
    state.idList.push(alert.id)
    return alert.id
  },

  [types.DISMISS] (state, { id }) {
    Vue.delete(state.entries, id)
    state.idList.splice(state.idList.indexOf(id), 1)
  },

  [types.CLEAR] (state) {
    for (let [k, v] of Object.entries(initialState())) {
      Vue.set(state, k, v)
    }
  },
}
