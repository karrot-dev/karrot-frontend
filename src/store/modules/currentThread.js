import messageAPI from '@/services/api/messages'
import { createMetaModule, withMeta, metaStatuses, createPaginationModule } from '@/store/helpers'
import { insertSorted } from './conversations'

function initialState () {
  return {
    id: null,
    messages: null,
    thread: {},
  }
}

export default {
  namespaced: true,
  modules: {
    meta: createMetaModule(),
    pagination: createPaginationModule(),
  },
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => {
      const messages = (state.messages || []).map(rootGetters['conversations/enrichMessage'])
      return {
        ...state.thread,
        messages,
        author: rootGetters['users/get'](state.thread.author),
        canFetchFuture: getters['pagination/canFetchNext'],
        sendStatus: getters.sendStatus,
        fetchStatus: getters.fetchStatus,
        fetchFutureStatus: getters.fetchFutureStatus,
      }
    },
    ...metaStatuses(['send', 'fetch', 'fetchFuture']),
  },
  actions: {
    ...withMeta({
      async send ({ dispatch }, { id, threadId, content }) {
        const message = await messageAPI.create({
          conversation: id,
          thread: threadId,
          content,
        })
        dispatch('receiveMessage', message)
      },
      async fetch ({ state, commit, dispatch }, messageId) {
        dispatch('clear')
        commit('setScope', messageId)
        const [firstMessage, messages] = await Promise.all([
          messageAPI.get(messageId),
          dispatch('pagination/extractCursor', messageAPI.listThread(messageId)),
        ])
        if (state.id !== messageId) return

        // initialize to make ConversationCompose detect a thread
        firstMessage.thread = firstMessage.id
        commit('setThread', firstMessage)
        // make sure that we always have a message (but not two times)
        messages.shift()
        messages.unshift(firstMessage)
        commit('update', messages)
      },

      async fetchFuture ({ state, dispatch, commit }) {
        const id = state.id
        const data = await dispatch('pagination/fetchNext', messageAPI.listMore)
        if (state.id !== id) return
        commit('update', data)
      },
    }, {
      findId: () => undefined,
    }),

    receiveMessage ({ commit, state }, message) {
      if (!state.id || message.thread !== state.id) return
      commit('update', [message])
    },

    clear ({ commit }) {
      commit('clear')
    },
  },
  mutations: {
    setScope (state, id) {
      state.id = id
    },
    setThread (state, thread) {
      state.thread = thread
    },
    update (state, messages) {
      const stateMessages = state.messages
      if (!stateMessages) {
        state.messages = messages
        return
      }
      insertSorted(stateMessages, messages, (a, b) => a.createdAt < b.createdAt)
    },
    addReaction (state, { userId, name, messageId }) {
      const message = state.messages.find(message => message.id === messageId)
      message.reactions.push({ user: userId, name })
    },
    removeReaction (state, { userId, name, messageId }) {
      const message = state.messages.find(message => message.id === messageId)
      const reactionIndex = message.reactions.findIndex(reaction => reaction.user === userId && reaction.name === name)
      message.reactions.splice(reactionIndex, 1)
    },
    clear (state) {
      Object.assign(state, initialState())
    },
  },
}
