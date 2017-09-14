import Vue from 'vue'
import messages from '@/services/api/messages'

const REVERSE = true

export const types = {
  SUBSCRIBE: 'Subscribe',
  UNSUBSCRIBE: 'Unsubscribe',

  REQUEST_MESSAGES: 'Request Messages',
  RECEIVE_MESSAGES: 'Receive Messages',
  RECEIVE_MESSAGES_ERROR: 'Receive Messages Error',
  RECEIVE_MESSAGE: 'Receive Message'
}

export const state = {
  conversations: {}
}

export const getters = {
  getById: state => id => state.conversations[id]
}

export const actions = {

  async subscribe ({ commit, dispatch }, { conversationId }) {
    commit(types.SUBSCRIBE, { conversationId })
    await dispatch('fetchMessagesByConversation', { conversationId })
  },

  async unsubscribe ({ commit }, { conversationId }) {
    commit(types.UNSUBSCRIBE, { conversationId })
  },

  async receiveMessage ({ commit }, { message }) {
    commit(types.RECEIVE_MESSAGE, { message })
  },

  async fetchMessagesByConversation ({ commit }, { conversationId }) {
    commit(types.REQUEST_MESSAGES, { conversationId })
    try {
      commit(types.RECEIVE_MESSAGES, { conversationId, messages: await messages.list(conversationId) })
    }
    catch (error) {
      commit(types.RECEIVE_MESSAGES_ERROR, { conversationId, error })
    }
  }
}

export const mutations = {

  [types.SUBSCRIBE] (state, { conversationId }) {
    update(conversationId, { isFetching: false, messages: [], error: null })
  },
  [types.UNSUBSCRIBE] (state, { conversationId }) {
    Vue.delete(state.conversations, conversationId)
  },

  [types.REQUEST_MESSAGES] (state, { conversationId }) {
    update(conversationId, { isFetching: true, messages: [], error: null })
  },
  [types.RECEIVE_MESSAGES] (state, { conversationId, messages }) {
    update(conversationId, { isFetching: false })
    maybeAddMessages(conversationId, messages)
  },
  [types.RECEIVE_MESSAGES_ERROR] (state, { conversationId, error }) {
    update(conversationId, { isFetching: false, error })
  },

  [types.RECEIVE_MESSAGE] (state, { message }) {
    let { conversation: { id: conversationId } = {} } = message
    maybeAddMessages(conversationId, [message])
  }

}

function update (conversationId, data) {
  Vue.set(state.conversations, conversationId, { ...state.conversations[conversationId], ...data })
}

function maybeAddMessages (conversationId, messages) {
  let conversation = state.conversations[conversationId]
  if (conversation) {
    if (REVERSE) {
      messages.reverse()
      conversation.messages.splice(0, 0, ...messages)
    }
    else {
      conversation.messages.push(...messages)
    }
  }
}
