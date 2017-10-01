import Vue from 'vue'
import messageAPI from '@/services/api/messages'

export const types = {
  SET_ACTIVE: 'Set Active',
  CLEAR_ACTIVE: 'Clear Active',

  REQUEST_MESSAGES: 'Request Messages',
  RECEIVE_MESSAGES: 'Receive Messages',
  RECEIVE_MESSAGES_ERROR: 'Receive Messages Error',

  REQUEST_MORE_MESSAGES: 'Request More Messages',
  RECEIVE_MORE_MESSAGES: 'Receive More Messages',
  RECEIVE_MORE_MESSAGES_ERROR: 'Receive More Messages Error',

  RECEIVE_MESSAGE: 'Receive Message',
  RECEIVE_CONVERSATION: 'Receive Conversation',

  REQUEST_SEND_MESSAGE: 'Request Send Message',
  RECEIVE_SEND_MESSAGE: 'Receive Send Message',
  RECEIVE_SEND_MESSAGE_ERROR: 'Receive Send Message Error',
}

export const state = {
  entries: {},
  messages: {}, // { <conversation-id> : [<message>,...] }
  cursors: {}, // { <conversation-id> : [<cursor>, ...]}
  activeConversationId: null,
  sendStatus: {
    isWaiting: false,
    error: null,
  },
  receiveStatus: {
    isWaiting: false,
    error: null,
  },
  receiveMoreStatus: {
    isWaiting: false,
    error: null,
  },
}

export const getters = {
  activeMessages: (state, getters, rootState, rootGetters) => {
    if (!state.activeConversationId) return []
    let messages = state.messages[state.activeConversationId]
    if (!messages) return []
    return messages.map(m => {
      return { ...m, author: rootGetters['users/get'](m.author) }
    })
  },
  sendStatus: state => state.sendStatus,
  receiveStatus: state => state.receiveStatus,
  receiveMoreStatus: state => state.receiveMoreStatus,
}

export const actions = {

  async setActive ({ commit, dispatch }, conversation) {
    commit(types.SET_ACTIVE, { conversationId: conversation.id })
    commit(types.RECEIVE_CONVERSATION, { conversation })
    await dispatch('fetchMessages', conversation.id)
  },

  async clearActive ({ commit }) {
    commit(types.CLEAR_ACTIVE)
  },

  async sendMessage ({ commit, state, dispatch }, messageData) {
    commit(types.REQUEST_SEND_MESSAGE)
    try {
      const message = await messageAPI.create({
        content: messageData,
        conversation: state.activeConversationId,
      })
      commit(types.RECEIVE_SEND_MESSAGE)
      commit(types.RECEIVE_MESSAGE, { message })
    }
    catch (error) {
      commit(types.RECEIVE_SEND_MESSAGE_ERROR, { error })
    }
  },

  async receiveMessage ({ commit, state, getters }, message) {
    // only add if messages doesn't exist yet
    if (!getters.activeMessages.find(e => e.id === message.id)) {
      commit(types.RECEIVE_MESSAGE, { message })
    }
  },

  async fetchMessages ({ commit }, conversationId) {
    commit(types.REQUEST_MESSAGES, { conversationId })
    let data
    try {
      data = await messageAPI.list(conversationId)
    }
    catch (error) {
      commit(types.RECEIVE_MESSAGES_ERROR, { conversationId, error })
      return
    }
    commit(types.RECEIVE_MESSAGES, { conversationId, messages: data.results, cursor: data.next })
  },

  async fetchMoreMessages ({ state, commit }) {
    // fetch more messages for active conversation
    const conversationId = state.activeConversationId
    const currentCursor = state.cursors[conversationId]
    if (!currentCursor) {
      return
    }
    commit(types.REQUEST_MORE_MESSAGES, { conversationId })

    let data
    try {
      data = await messageAPI.listMore(currentCursor)
    }
    catch (error) {
      commit(types.RECEIVE_MORE_MESSAGES_ERROR, { conversationId, error })
      return
    }
    commit(types.RECEIVE_MORE_MESSAGES, { conversationId, messages: data.results, cursor: data.next })
  },
}

export const mutations = {
  [types.SET_ACTIVE] (state, { conversationId }) {
    state.activeConversationId = conversationId
  },
  [types.CLEAR_ACTIVE] (state) {
    state.activeConversationId = null
  },

  // receive initial messages
  [types.REQUEST_MESSAGES] (state, { conversationId }) {
    state.receiveStatus = {
      isWaiting: true,
      error: null,
    }
  },
  [types.RECEIVE_MESSAGES] (state, { conversationId, messages, cursor }) {
    if (state.messages[conversationId]) {
      Vue.set(state.messages, conversationId, messages)
      Vue.set(state.cursors, conversationId, cursor)
    }
    if (state.activeConversationId === conversationId) {
      state.receiveStatus = {
        isWaiting: false,
        error: null,
      }
    }
  },
  [types.RECEIVE_MESSAGES_ERROR] (state, { conversationId, error }) {
    console.log(error)
    if (state.activeConversationId === conversationId) {
      state.receiveStatus = {
        isWaiting: false,
        error,
      }
    }
  },

  // receive more messages
  [types.REQUEST_MORE_MESSAGES] (state, { conversationId }) {
    state.receiveMoreStatus = {
      isWaiting: true,
      error: null,
    }
  },
  [types.RECEIVE_MORE_MESSAGES] (state, { conversationId, messages, cursor }) {
    // append at end
    if (state.messages[conversationId]) {
      state.messages[conversationId].push(...messages)
      Vue.set(state.cursors, conversationId, cursor)
    }
    if (state.activeConversationId === conversationId) {
      state.receiveMoreStatus = {
        isWaiting: false,
        error: null,
      }
    }
  },
  [types.RECEIVE_MORE_MESSAGES_ERROR] (state, { conversationId, error }) {
    if (state.activeConversationId === conversationId) {
      state.receiveMoreStatus = {
        isWaiting: false,
        error,
      }
    }
  },

  // receive conversation id
  [types.RECEIVE_CONVERSATION] (state, { conversation }) {
    let { id } = conversation
    Vue.set(state.entries, id, conversation)
    if (!state.messages[id]) {
      Vue.set(state.messages, id, [])
    }
  },

  // receive single message
  [types.RECEIVE_MESSAGE] (state, { message }) {
    let { conversation } = message
    if (state.messages[conversation]) {
      state.messages[conversation].unshift(message)
    }
  },

  [types.REQUEST_SEND_MESSAGE] (state) {
    state.sendStatus = {
      isWaiting: true,
      error: null,
    }
  },
  [types.RECEIVE_SEND_MESSAGE] (state) {
    state.sendStatus = {
      isWaiting: false,
      error: null,
    }
  },
  [types.RECEIVE_SEND_MESSAGE_ERROR] (state, { error }) {
    state.sendStatus = {
      isWaiting: false,
      error,
    }
  },
}
