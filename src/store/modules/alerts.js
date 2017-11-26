import Vue from 'vue'

let counter = 1 // start at 1 so it is always truthy

function initialState () {
  return {
    entries: {},
    idList: [],
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    all: (state, getters, rootState, rootGetters) => {
      // Transient alerts created via actions

      const alerts = state.idList.map(i => state.entries[i])

      // Derived state alerts

      const currentGroup = rootGetters['currentGroup/get']
      if (currentGroup && currentGroup.awaitingAgreement) {
        alerts.push({
          type: 'awaitingAgreement',
          context: currentGroup.activeAgreement,
          dismissible: true,
        })
      }

      return alerts
    },
  },
  actions: {
    create ({ commit }, alert) {
      return commit('create', alert)
    },
    dismiss ({ commit }, id) {
      commit('dismiss', id)
    },
    clear ({ commit }) {
      commit('clear')
    },
  },
  mutations: {
    create (state, alert) {
      alert.id = counter++
      Vue.set(state.entries, alert.id, alert)
      state.idList.push(alert.id)
      return alert.id
    },

    dismiss (state, id) {
      Vue.delete(state.entries, id)
      state.idList.splice(state.idList.indexOf(id), 1)
    },

    clear (state) {
      for (let [k, v] of Object.entries(initialState())) {
        Vue.set(state, k, v)
      }
    },
  },
}
