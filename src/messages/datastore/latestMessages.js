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
    entryMeta: {
      markedAt: null,
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
    unreadCount: (state, getters) => {
      return getters.unread.conversations.length + getters.unread.threads.length
    },
    allUnreadMuted: (state, getters) => {
      return (
        getters.unread.conversations.filter(c => !c.muted).length +
        getters.unread.threads.filter(t => !t.muted).length
      ) === 0
    },
    unseenCount: (state, getters) => {
      const { markedAt } = state.entryMeta

      return getters.unread.conversations.filter(c => c.latestMessage.createdAt > markedAt).length +
        getters.unread.threads.filter(t => t.latestMessage.createdAt > markedAt).length
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
      async markAllSeen ({ getters }) {
        // we can skip marking if there are only seen notifications
        if (!getters.unseenCount) return
        conversationsAPI.markAllSeen()
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
    updateConversationsAndRelated ({ commit, dispatch, rootState }, { conversations, messages, pickups, applications, issues, usersInfo, meta }) {
      if (conversations) {
        commit('updateConversations', conversations)

        // we need conversation data for threads too, so let's add them to the shared datastore
        for (const conversation of conversations) {
          dispatch('conversations/updateConversation', conversation, { root: true })
        }
      }
      if (messages) commit('updateConversationMessages', messages)
      if (pickups) {
        commit('pickups/update', pickups, { root: true })
      }
      if (applications) {
        commit('applications/update', applications, { root: true })
        const users = applications.map(a => a.user)
        commit('users/update', users, { root: true })
      }
      if (issues) {
        commit('issues/update', issues, { root: true })
      }
      if (usersInfo) {
        // contains only limited user info, so only update if we don't have the user already
        const users = usersInfo.filter(user => !rootState.users.entries[user.id])
        commit('users/update', users, { root: true })
      }

      if (meta) {
        commit('setEntryMeta', meta)
      }

      // fetch related objects one-by-one, in case they haven't been delivered already
      // needed for websocket updates
      if (!conversations) return
      for (const conversation of conversations) {
        if (conversation.type === 'pickup') {
          dispatch('pickups/maybeFetch', conversation.targetId, { root: true })
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

export function plugin (datastore) {
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (isLoggedIn) {
      // load unread messages for showing notifications
      datastore.dispatch('latestMessages/fetch', { excludeRead: true })
    }
    else {
      datastore.dispatch('latestMessages/clear')
    }
  })
}
