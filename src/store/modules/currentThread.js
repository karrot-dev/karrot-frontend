import messageAPI from '@/services/api/messages'
import { createMetaModule, withMeta, metaStatuses, createPaginationModule } from '@/store/helpers'
import { insertSorted } from './conversations'

function initialState () {
  return {
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
    id: state => state.thread && state.thread.id,
    get: (state, getters, rootState, rootGetters) => {
      const messages = (state.messages || []).map(rootGetters['conversations/enrichMessage'])
      return {
        ...state.thread,
        messages,
        canFetchPast: getters['pagination/canFetchNext'],
        sendStatus: getters.sendStatus,
        fetchStatus: getters.fetchStatus,
        fetchPastStatus: getters.fetchPastStatus,
      }
    },
    ...metaStatuses(['send', 'fetch', 'fetchPast']),
  },
  actions: {
    ...withMeta({
      async send ({ dispatch, getters }, { id, threadId, content }) {
        const message = await messageAPI.create({
          conversation: id,
          thread: threadId,
          content,
        })
        dispatch('receiveMessage', message)
      },
      async fetch ({ getters, commit, dispatch }, messageId) {
        dispatch('clear')
        commit('setThread', { id: messageId })
        const messages = await dispatch('pagination/extractCursor', messageAPI.listThread(messageId))
        if (getters.id !== messageId) return
        console.log('messageses', messages)
        commit('setThread', messages[messages.length - 1])
        commit('update', messages)
      },

      async fetchPast ({ getters, dispatch, commit }) {
        const id = getters.id
        const data = await dispatch('pagination/fetchNext', messageAPI.listMore)
        if (getters.id !== id) return
        commit('update', data)
      },
    }, {
      findId: () => undefined,
    }),

    receiveMessage ({ commit, getters }, message) {
      if (message.thread !== getters.id) return
      commit('update', [message])
    },

    clear ({ commit }) {
      commit('clear')
    },
  },
  mutations: {
    setThread (state, thread) {
      state.thread = thread
    },
    update (state, messages) {
      const stateMessages = state.messages
      if (!stateMessages) {
        state.messages = messages
        return
      }
      insertSorted(stateMessages, messages)
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
