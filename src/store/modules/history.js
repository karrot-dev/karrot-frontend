import historyAPI from '@/services/api/history'
import { indexById } from '@/store/helpers'

export const types = {
  REQUEST: 'Request',
  RECEIVE: 'Receive',
  RECEIVE_ERROR: 'Receive Error',

  CLEAR: 'Clear',
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
  canLoadMore: state => typeof state.cursor === 'string',
}

export const actions = {
  async fetchForActiveGroup ({ dispatch, commit, rootGetters }) {
    dispatch('clear')
    commit(types.REQUEST)
    const groupId = rootGetters['groups/activeGroupId']
    let data
    try {
      data = await historyAPI.list({ group: groupId })
    }
    catch (error) {
      commit(types.RECEIVE_ERROR, { error })
      throw error
    }
    commit(types.RECEIVE, { entries: data.results, cursor: data.next })
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
    commit(types.CLEAR)
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
      ...indexById(entries),
    }
    state.idList.push(...entries.map(e => e.id)) // TODO take care of duplicates
    state.cursor = cursor
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
