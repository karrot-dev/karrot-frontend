import Vue from 'vue'
import messageAPI from '@/services/api/messages'
import { createMetaModule, withMeta, metaStatusesWithId } from '@/store/helpers'

function initialState () {
  return {
    entries: {},
    messages: {}, // { <conversation-id> : [<message>,...] }
    cursors: {}, // { <conversation-id> : [<cursor>, ...]}
    activeConversationId: null,
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    enrichMessage: (state, getters, rootState, rootGetters) => message => {
      return {
        ...message,
        author: rootGetters['users/get'](message.author),
      }
    },
    activeMessages: (state, getters) => {
      return (state.messages[state.activeConversationId] || []).map(getters.enrichMessage)
    },
    active: (state, getters) => {
      const id = state.activeConversationId
      if (!id) return

      const canLoadMore = typeof state.cursors[state.activeConversationId] === 'string'
      return {
        messages: getters.activeMessages,
        canLoadMore,
        ...metaStatusesWithId(getters, ['send', 'fetch', 'fetchMore'], id),
      }
    },
  },
  actions: {
    ...withMeta({
      async send ({ commit, state, dispatch }, { id, messageData }) {
        const message = await messageAPI.create({
          content: messageData,
          conversation: id,
        })
        commit('prependMessage', { message })
      },
      async fetch ({ commit }, conversationId) {
        const data = await messageAPI.list(conversationId)
        commit('setMessages', { conversationId, messages: data.results, cursor: data.next })
      },

      async fetchMore ({ state, commit }, conversationId) {
        const currentCursor = state.cursors[conversationId]
        const data = await messageAPI.listMore(currentCursor)
        commit('appendMessages', { conversationId, messages: data.results, cursor: data.next })
      },
    }),

    async sendInActiveConversation ({ state, dispatch }, messageData) {
      dispatch('send', { id: state.activeConversationId, messageData })
    },

    async fetchMoreForActiveConversation ({ state, dispatch }) {
      const conversationId = state.activeConversationId
      const currentCursor = state.cursors[conversationId]
      if (!currentCursor) {
        return
      }
      await dispatch('fetchMore', conversationId)
    },

    async setActive ({ commit, dispatch }, conversation) {
      commit('setActive', { conversationId: conversation.id })
      commit('setConversation', { conversation })
      await dispatch('fetch', conversation.id)
    },

    async clearActive ({ commit }) {
      commit('clearActive')
    },

    async receiveMessage ({ commit, state, getters }, message) {
      // only add if messages doesn't exist yet

      if (!getters.activeMessages.find(e => e.id === message.id)) {
        commit('prependMessage', { message })
      }
    },
  },
  mutations: {
    setActive (state, { conversationId }) {
      state.activeConversationId = conversationId
    },
    clearActive (state) {
      state.activeConversationId = null
    },
    setMessages (state, { conversationId, messages, cursor }) {
      Vue.set(state.messages, conversationId, messages)
      Vue.set(state.cursors, conversationId, cursor)
    },
    appendMessages (state, { conversationId, messages, cursor }) {
      // e.g. when loading more (older) messages from the backend
      if (state.messages[conversationId]) {
        state.messages[conversationId].push(...messages)
        Vue.set(state.cursors, conversationId, cursor)
      }
    },
    setConversation (state, { conversation }) {
      Vue.set(state.entries, conversation.id, conversation)
    },
    prependMessage (state, { message }) {
      // e.g. when adding new messages from the current user or via websocket
      const { conversation } = message
      if (state.messages[conversation]) {
        state.messages[conversation].unshift(message)
      }
    },
  },
}
