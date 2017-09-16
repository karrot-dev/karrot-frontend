import Vue from 'vue'
import messages from '@/services/api/messages'
import { getter } from '@/store/helpers'

const REVERSE = true

export const types = {
  SUBSCRIBE: 'Subscribe',
  UNSUBSCRIBE: 'Unsubscribe',

  REQUEST_MESSAGES: 'Request Messages',
  RECEIVE_MESSAGES: 'Receive Messages',
  RECEIVE_MESSAGES_ERROR: 'Receive Messages Error',

  RECEIVE_MESSAGE: 'Receive Message',
  RECEIVE_CONVERSATION: 'Receive Conversation'
}

export const state = {
  conversations: {},
  messages: {},
  messagesMeta: {}
}

const getAuthor = getter('users/get')

export const getters = {
  getConversationById: state => id => state.conversations[id],
  getMessagesById: state => id => (state.messages[id] || []).map(m => {
    const author = getAuthor(m.author)
    return { ...m, author }
  })
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
    if (!state.messages[conversationId]) {
      Vue.set(state.messages, conversationId, [])
    }
    Vue.set(state.messagesMeta, conversationId, { ...state.messagesMeta[conversationId], isFetching: false, error: null })
  },
  [types.UNSUBSCRIBE] (state, { conversationId }) {
    Vue.delete(state.conversations, conversationId)
    Vue.delete(state.messages, conversationId)
    Vue.delete(state.messagesMeta, conversationId)
  },

  [types.REQUEST_MESSAGES] (state, { conversationId }) {
    Vue.set(state.messagesMeta, conversationId, { ...state.messagesMeta[conversationId], isFetching: true, error: null })
  },
  [types.RECEIVE_MESSAGES] (state, { conversationId, messages }) {
    Vue.set(state.messagesMeta, conversationId, { ...state.messagesMeta[conversationId], isFetching: false })
    if (!state.messages[conversationId]) {
      Vue.set(state.messages, conversationId, [])
    }
    maybeAddMessages(state, conversationId, messages)
  },
  [types.RECEIVE_MESSAGES_ERROR] (state, { conversationId, error }) {
    Vue.set(state.messagesMeta, conversationId, { ...state.messagesMeta[conversationId], isFetching: false, error })
  },

  [types.RECEIVE_CONVERSATION] (state, { conversation }) {
    Vue.set(state.conversations, conversation.id, conversation)
  },

  [types.RECEIVE_MESSAGE] (state, { message }) {
    let { conversation: { id: conversationId } = {} } = message
    maybeAddMessages(state, conversationId, [message])
  }

}

function maybeAddMessages (state, conversationId, messages) {
  let convMessages = state.messages[conversationId]
  if (convMessages) {
    if (REVERSE) {
      messages.reverse()
      convMessages.splice(0, 0, ...messages)
    }
    else {
      convMessages.push(...messages)
    }
  }
}
