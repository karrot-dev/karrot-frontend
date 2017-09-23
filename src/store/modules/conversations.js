import Vue from 'vue'
import messages from '@/services/api/messages'

export const types = {
  SET_ACTIVE: 'Set Active',
  CLEAR_ACTIVE: 'Clear Active',

  REQUEST_MESSAGES: 'Request Messages',
  RECEIVE_MESSAGES: 'Receive Messages',
  RECEIVE_MESSAGES_ERROR: 'Receive Messages Error',

  RECEIVE_MESSAGE: 'Receive Message',
  RECEIVE_CONVERSATION: 'Receive Conversation',

  REQUEST_SEND_MESSAGE: 'Request Send Message',
  RECEIVE_SEND_MESSAGE: 'Receive Send Message',
  RECEIVE_SEND_MESSAGE_ERROR: 'Receive Send Message Error',
}

export const state = {
  entries: {},
  messages: {}, // { <conversation-id> : [<message>,...] }
  activeConversationId: null,
  sendStatus: {
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
      // let message =
      await messages.create({
        content: messageData,
        conversation: state.activeConversationId,
      })
      dispatch('fetchMessages', state.activeConversationId) // TODO remove after message serializer has been fixed at backend
      commit(types.RECEIVE_SEND_MESSAGE)
      // commit(types.RECEIVE_MESSAGE, { message })
    }
    catch (error) {
      commit(types.RECEIVE_SEND_MESSAGE_ERROR, { error })
    }
  },

  async receiveMessage ({ commit, dispatch }, { message }) {
    dispatch('fetchMessages', state.activeConversationId) // TODO remove after message serializer has been fixed at backend
    // commit(types.RECEIVE_MESSAGE, { message })
  },

  async fetchMessages ({ commit }, conversationId) {
    commit(types.REQUEST_MESSAGES, { conversationId })
    try {
      commit(types.RECEIVE_MESSAGES, { conversationId, messages: await messages.list(conversationId) })
    }
    catch (error) {
      commit(types.RECEIVE_MESSAGES_ERROR, { conversationId, error })
    }
  },
}

export const mutations = {
  [types.SET_ACTIVE] (state, { conversationId }) {
    state.activeConversationId = conversationId
  },
  [types.CLEAR_ACTIVE] (state) {
    state.activeConversationId = null
  },
  [types.REQUEST_MESSAGES] (state, { conversationId }) {},
  [types.RECEIVE_MESSAGES] (state, { conversationId, messages }) {
    if (state.messages[conversationId]) {
      // state.messages[conversationId].push(...messages)
      Vue.set(state.messages, conversationId, messages)
    }
  },
  [types.RECEIVE_MESSAGES_ERROR] (state, { conversationId, error }) {},

  [types.RECEIVE_CONVERSATION] (state, { conversation }) {
    let { id } = conversation
    Vue.set(state.entries, id, conversation)
    if (!state.messages[id]) {
      Vue.set(state.messages, id, [])
    }
  },
  [types.RECEIVE_MESSAGE] (state, { message }) {
    let { conversation: { id: conversationId } = {} } = message
    if (state.messages[conversationId]) {
      state.messages[conversationId].push(message)
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
