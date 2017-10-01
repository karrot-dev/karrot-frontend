import Vue from 'vue'
import historyAPI from '@/services/api/history'

export const types = {
  REQUEST: 'Request',
  RECEIVE: 'Receive',
  RECEIVE_ERROR: 'Receive Error',

  ClEAR: 'Clear',
}

export const state = {
  entries: {},
  idList: [],
  cursor: null,
  receiveStatus: {
    isWaiting: false,
    error: null,
    success: true,
  },
}

export const getters = {
  all: state => state.idList.map(i => state.entries[i]),
  receiveStatus: state => state.receiveStatus,
}

export const actions = {
  async fetchGroupHistory ({ dispatch, commit, rootGetters }) {
    dispatch('clear')
    commit(types.REQUEST)
    try {
      const data = await historyAPI.list({ group: rootGetters['groups/activeGroupId'] })
      commit(types.RECEIVE, { entries: data.results, cursor: data.next })
    }
    catch (error) {
      commit(types.RECEIVE_ERROR, { error })
    }
  },

  async fetchMore ({ state, commit }) {
    if (!state.cursor) {
      return
    }
    commit(types.REQUEST)

    try {
      const data = await historyAPI.listMore(state.cursor)
      commit(types.RECEIVE, { entries: data.results, cursor: data.next })
    }
    catch (error) {
      commit(types.RECEIVE_ERROR, { error })
    }
  },

  clear ({ commit }) {
    commit(types.ClEAR)
  },
}

export const mutations = {
  [types.REQUEST] (state) {
    state.receiveStatus = {
      isWaiting: true,
      error: null,
      success: false,
    }
  },
  [types.RECEIVE] (state, { entries, cursor }) {
    state.receiveStatus = {
      isWaiting: false,
      error: null,
      success: true,
    }
    state.entries = {
      ...state.entries,
      ...entries,
    }
    state.idList.push(...entries.map(e => e.id)) // TODO take care of duplicates
    entries.cursor = cursor
  },
  [types.RECEIVE_ERROR] (state, { error }) {
    state.receiveStatus = {
      isWaiting: false,
      error,
      success: false,
    }
  },

  [types.CLEAR] (state) {
    state = {
      entries: {},
      idList: [],
      cursor: null,
      receiveStatus: {
        isWaiting: false,
        error: null,
        success: true,
      },
    }
  },
}
