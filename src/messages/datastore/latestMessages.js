import Vue from 'vue'
import messageAPI from '@/messages/api/messages'
import conversationsAPI from '@/messages/api/conversations'
import { insertSorted } from './conversations'
import { createMetaModule, withMeta, createPaginationModule, indexById } from '@/utils/datastore/helpers'

function initialState () {
  return {
    conversations: {},
    conversationMessages: {},
    threads: {},
    threadMessages: {},
    related: {}, // <type> -> { <id> -> <object> }, e.g. { offer: { 1: { name: 'a nice offer' } }
    fetchInitialDone: false,
    entryMeta: {
      conversationsMarkedAt: null,
      threadsMarkedAt: null,
    },
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
    unread: (state, getters) => {
      return {
        conversations: getters.conversations.filter(c => c.unreadMessageCount > 0),
        threads: getters.threads.filter(t => t.threadMeta.unreadReplyCount > 0),
      }
    },
    hasUnseenConversations: (state, getters) => {
      const { conversationsMarkedAt } = state.entryMeta

      return getters.unread.conversations.some(c => c.latestMessage.createdAt > conversationsMarkedAt)
    },
    hasUnseenThreads: (state, getters) => {
      const { threadsMarkedAt } = state.entryMeta

      return getters.unread.threads.some(t => t.latestMessage.createdAt > threadsMarkedAt)
    },
    conversations: (state, getters, rootState, rootGetters) => {
      const enrichConversation = rootGetters['conversations/enrichConversation']
      const enrichMessage = rootGetters['conversations/enrichMessage']

      return Object.values(state.conversations)
        .map(enrichConversation)
        .map(conversation => ({
          ...conversation,
          latestMessage: enrichMessage(getFirst(state.conversationMessages[conversation.id])),
        }))
        .filter(c => c.latestMessage)
        .sort(sortByLatestMessage)
    },
    canFetchPastConversations: (state, getters) => getters['conversationsPagination/canFetchNext'],
    fetchingPastConversations: (state, getters) => getters['meta/status']('fetchPastConversations').pending,
    threads: (state, getters, rootState, rootGetters) => {
      const enrichMessage = rootGetters['conversations/enrichMessage']

      return Object.values(state.threads)
        .filter(thread => thread)
        .map(enrichMessage)
        .map(thread => {
          return {
            ...thread,
            latestMessage: enrichMessage(getFirst(state.threadMessages[thread.id])),
          }
        })
        .filter(c => c.latestMessage)
        .sort(sortByLatestMessage)
    },
    canFetchPastThreads: (state, getters) => getters['threadsPagination/canFetchNext'],
    fetchingPastThreads: (state, getters) => getters['meta/status']('fetchPastThreads').pending,
    fetchInitialPending: (state, getters) => getters['meta/status']('fetchInitial').pending,
    getRelated: (state, getters, rootState, rootGetters) => (type, id) => {
      const related = state.related[type] && state.related[type][id]
      if (!related) return
      switch (type) {
        case 'offer': return rootGetters['offers/enrich'](related)
        default:
          return related
      }
    },
  },
  actions: {
    ...withMeta({
      async fetchInitial ({ state, commit, dispatch }) {
        if (state.fetchInitialDone) return
        await dispatch('fetch', { excludeRead: false })
        commit('fetchInitialDone', true)
      },
      async fetchPastConversations ({ dispatch }) {
        const data = await dispatch('conversationsPagination/fetchNext', conversationsAPI.listMore)
        dispatch('updateConversationsAndRelated', data)
      },
      async fetchPastThreads ({ dispatch }) {
        const data = await dispatch('threadsPagination/fetchNext', messageAPI.listMyThreadsMore)
        dispatch('updateThreadsAndRelated', data)
      },
      async clear ({ commit }) {
        commit('clear')
      },
      async markConversationsSeen ({ getters }) {
        // we can skip marking if there are only seen notifications
        if (getters.hasUnseenConversations) {
          conversationsAPI.markConversationsSeen()
        }
      },
      async markThreadsSeen ({ getters }) {
        // we can skip marking if there are only seen notifications
        if (getters.hasUnseenThreads) {
          conversationsAPI.markThreadsSeen()
        }
      },
    }),
    async fetch ({ dispatch }, { excludeRead = false } = {}) {
      const [conversationsAndRelated, threadsAndRelated] = await Promise.all([
        dispatch('conversationsPagination/extractCursor', conversationsAPI.list({ exclude_read: excludeRead })),
        dispatch('threadsPagination/extractCursor', messageAPI.listMyThreads({ exclude_read: excludeRead })),
      ])

      dispatch('updateConversationsAndRelated', conversationsAndRelated)
      dispatch('updateThreadsAndRelated', threadsAndRelated)
    },
    updateConversationsAndRelated ({ commit, dispatch, rootState }, {
      conversations,
      messages,
      activities,
      applications,
      issues,
      offers,
      usersInfo,
      meta,
    }) {
      if (conversations) {
        commit('updateConversations', conversations)

        // we need conversation data for threads too, so let's add them to the shared datastore
        for (const conversation of conversations) {
          dispatch('conversations/updateConversation', conversation, { root: true })
        }
      }
      if (messages) commit('updateConversationMessages', messages)
      if (activities) {
        commit('activities/update', activities, { root: true })
      }
      if (applications) {
        commit('applications/update', applications, { root: true })
        const users = applications.map(a => a.user)
        commit('users/update', users, { root: true })
      }
      if (issues) {
        commit('issues/update', issues, { root: true })
      }
      if (offers) {
        commit('updateRelated', { type: 'offer', items: offers })
      }
      if (usersInfo) {
        commit('users/updateInfo', usersInfo, { root: true })
      }

      if (meta) {
        commit('setEntryMeta', meta)
      }

      // fetch related objects one-by-one, in case they haven't been delivered already
      // needed for websocket updates
      if (!conversations) return
      for (const conversation of conversations) {
        if (conversation.type === 'activity') {
          dispatch('activities/maybeFetch', conversation.targetId, { root: true })
        }
        else if (conversation.type === 'application') {
          dispatch('applications/maybeFetchOne', conversation.targetId, { root: true })
        }
      }
    },
    updateThreadsAndRelated ({ commit, dispatch }, { threads, messages }) {
      if (threads) commit('updateThreads', threads)
      if (messages) commit('updateThreadMessages', messages)

      // fetch related conversations, in case they haven't been delivered already
      if (!threads) return
      for (const thread of threads) {
        dispatch('conversations/maybeFetchConversation', thread.conversation, { root: true })
      }
    },
  },
  mutations: {
    clear (state) {
      Object.assign(state, initialState())
    },
    updateConversations (state, conversations) {
      state.conversations = Object.freeze({ ...state.conversations, ...indexById(conversations) })
    },
    updateConversationMessages (state, messages) {
      for (const message of messages) {
        const conversationId = message.conversation
        const stateMessages = state.conversationMessages[conversationId]
        Vue.set(
          state.conversationMessages,
          conversationId,
          Object.freeze(stateMessages ? insertSorted(stateMessages, [message]) : [message]),
        )
      }
    },
    setConversationsCursor (state, cursor) {
      state.conversationsCursor = cursor
    },
    updateThreads (state, threads) {
      state.threads = Object.freeze({ ...state.threads, ...indexById(threads) })
    },
    updateThreadMessages (state, messages) {
      for (const message of messages) {
        const threadId = message.thread
        const stateMessages = state.threadMessages[threadId]
        Vue.set(
          state.threadMessages,
          threadId,
          Object.freeze(stateMessages ? insertSorted(stateMessages, [message]) : [message]),
        )
      }
    },
    updateRelated (state, { type, items }) {
      Vue.set(state.related, type, Object.freeze({ ...state.related[type], ...indexById(items) }))
    },
    deleteRelated (state, { type, ids }) {
      if (!state.related[type]) return
      const rest = Object.fromEntries(Object.entries(state.related[type]).filter(([k, _]) => !ids.include(k)))
      if (rest.length === 0) {
        Vue.delete(state.related, type)
      }
      else {
        Vue.set(state.related, type, rest)
      }
    },
    setThreadsCursor (state, cursor) {
      state.threadsCursor = cursor
    },
    fetchInitialDone (state, value) {
      state.fetchInitialDone = value
    },
    setEntryMeta (state, data) {
      state.entryMeta = data
    },
  },
}

function sortByLatestMessage (a, b) {
  return b.latestMessage.createdAt - a.latestMessage.createdAt
}

function getFirst (list) {
  if (!list || list.length === 0) return
  return list[0]
}

export const plugin = datastore => {
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('latestMessages/clear')
      datastore.commit('latestMessages/conversationsPagination/clear')
      datastore.commit('latestMessages/threadsPagination/clear')
    }
  })
}
