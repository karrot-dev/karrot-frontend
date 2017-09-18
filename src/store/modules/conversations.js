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
}

export const state = {
  entries: {},
  messages: {}, // { <conversation-id> : [<message>,...] }
  activeConversationId: null,
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

  async receiveMessage ({ commit }, { message }) {
    commit(types.RECEIVE_MESSAGE, { message })
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
      state.messages[conversationId].push(...messages)
    }
  },
}
