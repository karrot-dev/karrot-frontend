import Vue from 'vue'
import agreements from '@/services/api/agreements'

export const types = {
  REQUEST_ENTRY: 'Request Entry',
  REQUEST_AGREE: 'Request Agree',
  REQUEST_CREATE: 'Request Create',
  REQUEST_SAVE: 'Request Save',
  REQUEST_DESTROY: 'Request Destroy',
  RECEIVE_ENTRY: 'Receive Entry',
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
  async create ({ commit }, agreement) {
    commit(types.REQUEST_CREATE)
    agreement = await agreements.create(agreement)
    commit(types.RECEIVE_ENTRY, { agreement })
    return agreement
  },
  async save ({ commit }, agreement) {
    commit(types.REQUEST_SAVE)
    agreement = await agreements.save(agreement)
    commit(types.RECEIVE_ENTRY, { agreement })
    return agreement
  },
}

export const mutations = {
  [types.REQUEST_ENTRY] (state) {},
  [types.REQUEST_AGREE] (state) {},
  [types.REQUEST_SAVE] (state) {},
  [types.REQUEST_CREATE] (state) {},
  [types.RECEIVE_ENTRY] (state, { agreement }) {
    Vue.set(state.entries, agreement.id, agreement)
  },
}
