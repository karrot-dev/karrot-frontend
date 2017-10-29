import Vue from 'vue'
import agreements from '@/services/api/agreements'

export const types = {
  REQUEST_ENTRY: 'Request Entry',
  RECEIVE_ENTRY: 'Receive Entry',
  REQUEST_AGREE: 'Request Agree',
}

function initialState () {
  return {
    entries: {},
  }
}

export const state = initialState()

export const getters = {
  get: state => id => {
    return state.entries[id]
  },
}

export const actions = {
  async fetch ({ commit }, id) {
    commit(types.REQUEST_ENTRY)
    commit(types.RECEIVE_ENTRY, { agreement: await agreements.get(id) })
  },
  async agree ({ commit }, id) {
    commit(types.REQUEST_AGREE)
    commit(types.RECEIVE_ENTRY, { agreement: await agreements.agree(id) })
  },
}

export const mutations = {
  [types.REQUEST_ENTRY] (state) {},
  [types.REQUEST_AGREE] (state) {},
  [types.RECEIVE_ENTRY] (state, { agreement }) {
    Vue.set(state.entries, agreement.id, agreement)
  },
}
