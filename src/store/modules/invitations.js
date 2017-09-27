import invitations from '@/services/api/invitations'

export const types = {
  REQUEST_LIST: 'Request List',
  RECEIVE_LIST: 'Receive List',
  RECEIVE_LIST_ERROR: 'Receive List Error',

  REQUEST_SEND: 'Request Send',
  RECEIVE_SEND: 'Receive Send',
  RECEIVE_SEND_ERROR: 'Receive Send Error',

  REQUEST_ACCEPT: 'Request Accept',
  RECEIVE_ACCEPT: 'Receive Accept',
  RECEIVE_ACCEPT_ERROR: 'Receive Accept Error',

  CLEAR: 'Clear',
}

export const state = {
  entries: {},
  idList: [],
  listStatus: {
    isWaiting: false,
    error: null,
  },
  sendStatus: {
    isWaiting: false,
    error: null,
  },
  acceptStatus: {
    isWaiting: false,
    error: null,
  },
}

export const getters = {
  listStatus: state => state.listStatus,
  sendStatus: state => state.sendStatus,
  acceptStatus: state => state.acceptStatus,
  list: state => state.idList.map(i => state.entries[i]),
}

export const actions = {
  /**
   * Fetch open invitations by group ID
   */
  async fetchList ({ commit }, groupId) {
    commit(types.REQUEST_LIST)
    try {
      const list = await invitations.listByGroupId(groupId)
      commit(types.RECEIVE_LIST, { list })
    }
    catch (error) {
      commit(types.RECEIVE_LIST_ERROR, { error })
    }
  },

  /**
   * Send invitation to e-mail
   */
  async send ({ commit }, email) {
    // TODO if not already invited
    commit(types.REQUEST_SEND)
    try {
      const invited = await invitations.create({
        email,
        group: 1, // TODO active group id
      })
      commit(types.RECEIVE_SEND, { invited })
    }
    catch (error) {
      commit(types.RECEIVE_SEND_ERROR, { error })
    }
  },

  /**
   * Accept invitation with token
   */
  async accept ({ commit }, token) {
    commit(types.REQUEST_ACCEPT)
    try {
      await invitations.accept(token)
      commit(types.RECEIVE_ACCEPT)
    }
    catch (error) {
      commit(types.RECEIVE_ACCEPT_ERROR, { error })
    }
  },

  /**
   * Reset all state
   */
  clear ({ commit }) {
    commit(types.CLEAR)
  },
}

export const mutations = {
  // TODO
}
