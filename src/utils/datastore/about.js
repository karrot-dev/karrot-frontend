import about from '@/utils/api/about'

function initialState () {
  return {
    deployed: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    deployed: state => state.deployed,
  },
  actions: {
    async fetch ({ commit }) {
      try {
        commit('setDeployed', await about.get())
      }
      catch (e) {}
    },
  },
  mutations: {
    setDeployed (state, deployed) {
      state.deployed = deployed
    },
  },
}
