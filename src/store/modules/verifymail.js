import users from '@/services/api/users'

export const types = {
  REQUEST: 'Request',
  RECEIVE: 'Receive',
  RECEIVE_ERROR: 'Receive Error',
  CLEAN: 'Clean',
}

function initialState () {
  return {
    status: {
      isWaiting: false,
      error: null,
      success: false,
    },
  }
}

export const state = initialState()

export const getters = {
  status: state => state.status,
}

export const actions = {
  async verify ({ commit }, key) {
    commit(types.REQUEST)
    try {
      await users.verifyMail(key)
      commit(types.RECEIVE)
    }
    catch (error) {
      commit(types.RECEIVE_ERROR, { error })
    }
  },
}

export const mutations = {
  [types.REQUEST] (state) {
    state.status = {
      isWaiting: true,
      error: null,
      success: false,
    }
  },
  [types.RECEIVE] (state) {
    state.status = {
      isWaiting: false,
      error: null,
      success: true,
    }
  },
  [types.RECEIVE_ERROR] (state, { error }) {
    state.status = {
      isWaiting: false,
      error,
      success: false,
    }
  },
  [types.CLEAN] (state) {
    state.status = {
      isWaiting: false,
      error: null,
      success: false,
    }
  },
}
