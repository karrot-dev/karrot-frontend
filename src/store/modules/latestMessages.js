import messageAPI from '@/services/api/messages'
import conversationsAPI from '@/services/api/conversations'
import { insertSorted } from './conversations'
import { createMetaModule, withMeta, createPaginationModule } from '@/store/helpers'

function initialState () {
  return {
    conversations: [],
    threads: [],
  }
}

export default {
  namespaced: true,
  modules: {
    meta: createMetaModule(),
    conversationsPagination: createPaginationModule(),
    threadsPagination: createPaginationModule(),
  },
  state: initialState(),
  getters: {
    unreadCount: (state, getters) => {
      const unreadConversations = getters.conversations.filter(c => c.unreadMessageCount > 0).length
      const unreadThreads = getters.threads.filter(t => t.unreadReplyCount > 0).length
      return unreadConversations + unreadThreads
    },
    conversations: (state, getters, rootState, rootGetters) => {
      return state.conversations.map(rootGetters['conversations/enrichConversation'])
    },
    canFetchPastConversations: (state, getters) => getters['conversationsPagination/canFetchNext'],
    fetchingPastConversations: (state, getters) => getters['meta/status']('fetchPastConversations').pending,
    threads: (state, getters, rootState, rootGetters) => {
      const enrichMessage = rootGetters['conversations/enrichMessage']
      return state.threads.map(enrichMessage).map(thread => {
        if (!thread) return
        return {
          ...thread,
          latestMessage: thread.latestMessage && enrichMessage(thread.latestMessage),
        }
      })
    },
    canFetchPastThreads: (state, getters) => getters['threadsPagination/canFetchNext'],
    fetchingPastThreads: (state, getters) => getters['meta/status']('fetchPastThreads').pending,
  },
  actions: {
    ...withMeta({
      async fetch ({ commit, dispatch }) {
        const [conversations, threads] = await Promise.all([
          dispatch('conversationsPagination/extractCursor', conversationsAPI.list()),
          dispatch('threadsPagination/extractCursor', messageAPI.listMyThreads()),
        ])
        commit('updateConversations', conversations)
        commit('updateThreads', threads)

        dispatch('fetchRelatedPickups', conversations)
        dispatch('fetchRelatedApplications', conversations)
      },
      async fetchPastConversations ({ commit, dispatch }) {
        const data = await dispatch('conversationsPagination/fetchNext', conversationsAPI.listMore)
        commit('updateConversations', data)

        dispatch('fetchRelatedPickups', data)
        dispatch('fetchRelatedApplications', data)
      },
      async fetchPastThreads ({ commit, dispatch }) {
        const data = await dispatch('threadsPagination/fetchNext', messageAPI.listMore)
        commit('updateThreads', data)
      },
      async clear ({ commit }) {
        commit('clear')
      },
    }),
    fetchRelatedPickups ({ dispatch }, conversations) {
      // fetch related pickups for pickup chat
      // TODO: should be delivered by the backend API for better performance
      for (const c of conversations.filter(c => c.type === 'pickup')) {
        dispatch('pickups/maybeFetch', c.targetId, { root: true })
      }
    },
    fetchRelatedApplications ({ dispatch }, conversations) {
      // TODO: should be delivered by the backend API for better performance
      for (const c of conversations.filter(c => c.type === 'application')) {
        dispatch('groupApplications/maybeFetchOne', c.targetId, { root: true })
      }
    },
    updateConversation ({ commit }, conversation) {
      commit('updateConversations', [conversation])
    },
    updateThread ({ commit }, thread) {
      commit('updateThreads', [thread])
    },
  },
  mutations: {
    clear (state) {
      Object.assign(state, initialState())
    },
    updateConversations (state, conversations) {
      insertSorted(state.conversations, conversations.filter(c => c.latestMessage), sortByLatestMessage)
    },
    setConversationsCursor (state, cursor) {
      state.conversationsCursor = cursor
    },
    updateThreads (state, threads) {
      insertSorted(state.threads, threads.filter(c => c.latestMessage), sortByLatestMessage)
    },
    setThreadsCursor (state, cursor) {
      state.threadsCursor = cursor
    },
  },
}

function sortByLatestMessage (a, b) {
  if (!a.latestMessage) return false
  if (!b.latestMessage) return true
  return a.latestMessage.createdAt > b.latestMessage.createdAt
}
