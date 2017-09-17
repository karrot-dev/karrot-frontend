import Vue from 'vue'
import about from '@/services/api/about'

export const types = {
  SET_ABOUT: 'Set About',
  SET_ABOUT_ERROR: 'Set About Error',
}

export const state = {
  error: null,
}

export const getters = {
  get: state => state,
}

export const actions = {
  async fetchAbout ({ commit }) {
    try {
      commit(types.SET_ABOUT, { about: await about.get() })
    }
    catch (error) {
      commit(types.SET_ABOUT_ERROR, { error })
    }
  },
}

export const mutations = {
  [types.SET_ABOUT] (state, { about }) {
    state.error = null
    for (let [k, v] of Object.entries(about)) {
      Vue.set(state, k, v)
    }
  },
  [types.SET_ABOUT_ERROR] (state, { error }) {
    state.error = error
  },
}
