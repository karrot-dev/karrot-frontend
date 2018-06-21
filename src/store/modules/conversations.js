import Vue from 'vue'
import differenceInSeconds from 'date-fns/difference_in_seconds'
import messageAPI from '@/services/api/messages'
import conversationsAPI from '@/services/api/conversations'
import reactionsAPI from '@/services/api/reactions'
import i18n from '@/i18n'
import { createMetaModule, withMeta, withPrefixedIdMeta, metaStatusesWithId } from '@/store/helpers'

export function isUnread (message, conversation) {
  if (!message || !conversation) return
  if (!conversation.seenUpTo) return true
  return message.id > conversation.seenUpTo
}

export function readableReactionMessage (reaction) {
  if (!reaction.users.length) return ''
  // form the message which users reacted
  // i.e. "foo, bar and baz reacted with heart"
  const names = reaction.users.filter(u => !u.isCurrentUser).map(u => u.displayName)
  if (names.length !== reaction.users.length) {
    names.unshift(i18n.t('CONVERSATION.REACTIONS.YOU'))
  }

  const andSeparated = names.slice(-2).join(` ${i18n.t('CONVERSATION.REACTIONS.AND')} `)
  const nameMessage = [...names.slice(0, -2), andSeparated].join(', ')

  return i18n.t('CONVERSATION.REACTIONS.REACTED_WITH', {
    users: nameMessage,
    reaction: `:${reaction.name}:`,
  })
}

export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}

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
    get: (state, getters, rootState, rootGetters) => conversationId => {
      const canLoadMore = typeof state.cursors[conversationId] === 'string'
      const conversation = getters.enrichConversation(state.entries[conversationId])
      const messages = (state.messages[conversationId] || []).map(getters.enrichMessage)
      return {
        ...conversation,
        messages,
        canLoadMore,
        ...metaStatusesWithId(getters, ['send', 'fetch', 'fetchMore'], conversationId),
      }
    },
    enrichReactions: (state, getters, rootState, rootGetters) => reactions => {
      if (!reactions || !reactions.length) return []
      const groupedReactions = reactions.reduce((acc, reaction) => {
        if (!acc[reaction.name]) {
          acc[reaction.name] = {
            name: reaction.name,
            users: [],
            reacted: false,
          }
        }
        const user = rootGetters['users/get'](reaction.user)
        acc[reaction.name].users.push(user)
        if (user.isCurrentUser) {
          acc[reaction.name].reacted = true
        }
        return acc
      }, {})

      return Object.values(groupedReactions).map(reaction => {
        return {
          ...reaction,
          message: readableReactionMessage(reaction),
        }
      }).sort(sortByName)
    },
    enrichMessage: (state, getters, rootState, rootGetters) => message => {
      if (!message) return
      return {
        ...message,
        reactions: getters.enrichReactions(message.reactions),
        author: rootGetters['users/get'](message.author),
        isUnread: isUnread(message, state.entries[message.conversation]),
        saveStatus: getters['meta/status']('saveMessage', `message/${message.id}`),
        isEdited: differenceInSeconds(message.updatedAt, message.createdAt) > 10,
      }
    },
    enrichConversation: (state, getters, rootState, rootGetters) => conversation => {
      if (!conversation) return
      return {
        ...conversation,
        participants: conversation.participants.map(rootGetters['users/get']),
      }
    },
    activeMessages: (state, getters) => {
      return (state.messages[state.activeConversationId] || []).map(getters.enrichMessage)
    },
    activeConversation: (state, getters) => {
      if (!state.activeConversationId) return
      return getters.enrichConversation(state.entries[state.activeConversationId])
    },
    active: (state, getters) => {
      const id = state.activeConversationId
      if (!id) return

      const canLoadMore = typeof state.cursors[state.activeConversationId] === 'string'
      return {
        ...getters.activeConversation,
        messages: getters.activeMessages,
        canLoadMore,
        ...metaStatusesWithId(getters, ['send', 'fetch', 'fetchMore'], id),
      }
    },
  },
  actions: {
    ...withMeta({
      async send ({ dispatch }, { id, messageData }) {
        const message = await messageAPI.create({
          content: messageData,
          conversation: id,
        })
        dispatch('receiveMessage', message)
      },
      async fetch ({ commit }, conversationId) {
        const data = await messageAPI.list(conversationId)
        commit('updateMessages', {
          messages: data.results,
          conversationId,
        })
        commit('setCursor', {
          conversationId,
          cursor: data.next,
        })
      },

      async fetchMore ({ state, commit }, conversationId) {
        const currentCursor = state.cursors[conversationId]
        const data = await messageAPI.listMore(currentCursor)
        commit('updateMessages', {
          messages: data.results,
          conversationId,
        })
        commit('setCursor', {
          conversationId,
          cursor: data.next,
        })
      },

      async fetchConversation ({ commit }, conversationId) {
        commit('setConversation', { conversation: await conversationsAPI.get(conversationId) })
      },

      async mark ({ dispatch }, { id, seenUpTo }) {
        if (id) {
          await conversationsAPI.mark(id, { seenUpTo })
        }
      },

      async toggleEmailNotifications ({ commit }, { conversationId, value }) {
        await conversationsAPI.toggleEmailNotifications(conversationId, value)
        commit('updateEmailNotifications', { conversationId, value })
      },
    }),

    ...withPrefixedIdMeta('message/', {
      async saveMessage ({ dispatch }, { message, done }) {
        const updatedMessage = await messageAPI.save(message)
        done()
        dispatch('receiveMessage', updatedMessage)
      },
    }, {
      findId: data => data.message.id,
    }),

    async maybeToggleEmailNotifications ({ state, getters, dispatch }, { conversationId, value }) {
      if (state.entries[conversationId]) {
        const changed = state.entries[conversationId].emailNotifications !== value
        const pending = getters['meta/status']('toggleEmailNotifications').pending
        if (changed && !pending) {
          await dispatch('toggleEmailNotifications', { conversationId, value })
        }
      }
    },

    async toggleReaction ({ state, commit, rootGetters }, { conversationId, messageId, name }) {
      if (!conversationId) conversationId = state.activeConversationId
      // current user's id
      const userId = rootGetters['auth/userId']
      // see if the reaction already exists or not
      const message = state.messages[conversationId].find(message => message.id === messageId)
      const reactionIndex = message.reactions.findIndex(reaction => reaction.user === userId && reaction.name === name)

      if (reactionIndex === -1) {
        const addedReaction = await reactionsAPI.create(messageId, name)
        commit('addReaction', { conversationId, messageId, name: addedReaction.name, userId })
      }
      else {
        await reactionsAPI.remove(messageId, name)
        commit('removeReaction', { conversationId, messageId, name, userId })
      }
    },

    async sendInActiveConversation ({ state, dispatch }, messageData) {
      dispatch('send', { id: state.activeConversationId, messageData })
    },
    async markAllReadInActiveConversation ({ state, dispatch, getters }) {
      const newestMessage = getters.activeMessages[0]
      dispatch('mark', { id: state.activeConversationId, seenUpTo: newestMessage.id })
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

    clearConversation ({ commit }, conversationId) {
      commit('clearConversation', { conversationId })
    },

    clearActive ({ commit }) {
      commit('clearActive')
    },

    receiveMessage ({ commit }, message) {
      commit('updateMessages', {
        messages: [message],
        conversationId: message.conversation,
      })
    },

    updateConversation ({ state, commit }, conversation) {
      const existing = state.entries[conversation.id]
      if (existing && existing.updatedAt <= conversation.updatedAt) {
        commit('setConversation', { conversation })
      }
    },

    refresh ({ state, dispatch }) {
      Object.values(state.entries).forEach(async conversation => {
        await dispatch('updateConversation', await conversationsAPI.get(conversation.id))
        dispatch('fetch', conversation.id)
      })
    },
  },
  mutations: {
    setActive (state, { conversationId }) {
      state.activeConversationId = conversationId
    },
    clearActive (state) {
      state.activeConversationId = null
    },
    clearConversation (state, { conversationId }) {
      Vue.delete(state.entries, conversationId)
      Vue.delete(state.messages, conversationId)
    },
    updateMessages (state, { conversationId, messages }) {
      if (!state.messages[conversationId]) {
        Vue.set(state.messages, conversationId, messages)
        return
      }
      // simple insertion sort for new messages
      // assumes that existing messages are sorted AND incoming messages are sorted
      let i = 0
      for (let message of messages) {
        const stateMessages = state.messages[conversationId]
        while (i < stateMessages.length && stateMessages[i].createdAt > message.createdAt) i++

        // decide if we should append, update or insert a message
        if (i >= stateMessages.length) {
          stateMessages.push(message)
        }
        else if (stateMessages[i].id === message.id) {
          Vue.set(stateMessages, i, message)
        }
        else {
          stateMessages.splice(i, 0, message)
        }
      }
    },
    setCursor (state, { conversationId, cursor }) {
      Vue.set(state.cursors, conversationId, cursor)
    },
    setConversation (state, { conversation }) {
      Vue.set(state.entries, conversation.id, conversation)
    },
    updateEmailNotifications (state, { conversationId, value }) {
      state.entries[conversationId].emailNotifications = value
    },
    addReaction (state, { userId, name, messageId, conversationId }) {
      const message = state.messages[conversationId].find(message => message.id === messageId)
      message.reactions.push({ user: userId, name })
    },
    removeReaction (state, { userId, name, messageId, conversationId }) {
      const message = state.messages[conversationId].find(message => message.id === messageId)
      const reactionIndex = message.reactions.findIndex(reaction => reaction.user === userId && reaction.name === name)
      message.reactions.splice(reactionIndex, 1)
    },
  },
}
