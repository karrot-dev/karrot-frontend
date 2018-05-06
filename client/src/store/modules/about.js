import about from '@/services/api/about'

function initialState () {
  return {
    about: null,
  }
}

export default {
  namespaced: true,
  state: initialState(),
  getters: {
    get: state => state.about,
  },
  actions: {
    async fetch ({ commit }) {
      try {
        commit('setAbout', await about.get())
      }
      catch (e) {}
    },
  },
  mutations: {
    setAbout (state, about) {
      state.about = about
    },
  },
}
