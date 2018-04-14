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
      // Transient banners created via actions

      const banners = state.idList.map(i => state.entries[i])

      // Derived state banners

      const currentGroup = rootGetters['currentGroup/value']
      const isGroupPage = rootGetters['route/isGroupPage']
      if (isGroupPage && currentGroup && currentGroup.awaitingAgreement) {
        banners.push({
          type: 'awaitingAgreement',
          context: currentGroup.activeAgreement,
          dismissible: true,
        })
      }
      if (isGroupPage && currentGroup && currentGroup.isPlayground) {
        banners.push({
          type: 'playgroundGroupInfo',
          dismissible: false,
          desktopOnly: true,
        })
      }

      return banners
    },
  },
  actions: {
    create ({ commit }, banner) {
      return commit('create', banner)
    },
    dismiss ({ commit }, id) {
      commit('dismiss', id)
    },
    clear ({ commit }) {
      commit('clear')
    },
  },
  mutations: {
    create (state, banner) {
      banner.id = counter++
      Vue.set(state.entries, banner.id, banner)
      state.idList.push(banner.id)
      return banner.id
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
