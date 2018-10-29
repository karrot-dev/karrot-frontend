import Vue from 'vue'
import messageAPI from '@/messages/api/messages'
import conversationsAPI from '@/messages/api/conversations'
import { insertSorted } from './conversations'
import { createMetaModule, withMeta, createPaginationModule } from '@/utils/datastore/helpers'

function initialState () {
  return {
    conversations: {},
    conversationMessages: {},
    threads: {},
    threadMessages: {},
    fetchInitialDone: false,
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
        threads: getters.threads.filter(t => t.unreadReplyCount > 0),
      }
    },
    unreadCount: (state, getters) => {
      return getters.unread.conversations.length + getters.unread.threads.length
    },
    allUnreadMuted: (state, getters) => {
      return (
        getters.unread.conversations.filter(c => c.emailNotifications).length +
        getters.unread.threads.filter(t => !t.muted).length
      ) === 0
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
        .map(enrichMessage)
        .map(thread => {
          if (!thread) return
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
    }),
    async fetch ({ commit, dispatch }, { excludeRead = false } = {}) {
      const [conversationsAndRelated, threadsAndRelated] = await Promise.all([
        dispatch('conversationsPagination/extractCursor', conversationsAPI.list({ exclude_read: excludeRead })),
        dispatch('threadsPagination/extractCursor', messageAPI.listMyThreads({ exclude_read: excludeRead })),
      ])

      dispatch('updateConversationsAndRelated', conversationsAndRelated)
      dispatch('updateThreadsAndRelated', threadsAndRelated)
    },
    updateConversationsAndRelated ({ commit, dispatch, rootState }, { conversations, messages, pickups, applications, usersInfo }) {
      if (conversations) commit('updateConversations', conversations)
      if (messages) commit('updateConversationMessages', messages)
      if (pickups) {
        for (const pickup of pickups) {
          dispatch('pickups/update', pickup, { root: true })
        }
      }
      if (applications) {
        commit('groupApplications/update', applications, { root: true })
        for (const application of applications) {
          dispatch('users/update', application.user, { root: true })
        }
      }
      if (usersInfo) {
        for (const user of usersInfo) {
          // contains only limited user info, so only update if we don't have the user already
          if (!rootState.users.entries[user.id]) {
            dispatch('users/update', user, { root: true })
          }
        }
      }

      // fetch related objects one-by-one, in case they haven't been delivered already
      // needed for websocket updates
      if (!conversations) return
      for (const conversation of conversations) {
        if (conversation.type === 'pickup') {
          dispatch('pickups/maybeFetch', conversation.targetId, { root: true })
        }
        else if (conversation.type === 'application') {
          dispatch('groupApplications/maybeFetchOne', conversation.targetId, { root: true })
        }
      }
    },
    updateThreadsAndRelated ({ commit }, { threads, messages }) {
      if (threads) commit('updateThreads', threads)
      if (messages) commit('updateThreadMessages', messages)
    },
    refresh ({ dispatch }) {
      dispatch('fetch')
    },
  },
  mutations: {
    clear (state) {
      Object.assign(state, initialState())
    },
    updateConversations (state, conversations) {
      for (const conversation of conversations) {
        Vue.set(state.conversations, conversation.id, conversation)
      }
    },
    updateConversationMessages (state, messages) {
      for (const message of messages) {
        const conversationId = message.conversation
        const stateMessages = state.conversationMessages[conversationId]
        if (!stateMessages) {
          Vue.set(state.conversationMessages, conversationId, [message])
        }
        else {
          insertSorted(stateMessages, [message])
        }
      }
    },
    setConversationsCursor (state, cursor) {
      state.conversationsCursor = cursor
    },
    updateThreads (state, threads) {
      for (const thread of threads) {
        Vue.set(state.threads, thread.id, thread)
      }
    },
    updateThreadMessages (state, messages) {
      for (const message of messages) {
        const threadId = message.thread
        const stateMessages = state.threadMessages[threadId]
        if (!stateMessages) {
          Vue.set(state.threadMessages, threadId, [message])
        }
        else {
          insertSorted(stateMessages, [message])
        }
      }
    },
    setThreadsCursor (state, cursor) {
      state.threadsCursor = cursor
    },
    fetchInitialDone (state, value) {
      state.fetchInitialDone = value
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

export function plugin (store) {
  store.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (isLoggedIn) {
      // load unread messages for showing notifications
      store.dispatch('latestMessages/fetch', { excludeRead: true })
    }
    else {
      store.dispatch('latestMessages/clear')
    }
  })
}
