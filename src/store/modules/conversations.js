import Vue from 'vue'
import differenceInSeconds from 'date-fns/difference_in_seconds'
import messageAPI from '@/services/api/messages'
import conversationsAPI from '@/services/api/conversations'
import reactionsAPI from '@/services/api/reactions'
import pickupsAPI from '@/services/api/pickups'
import usersAPI from '@/services/api/users'
import groupsAPI from '@/services/api/groups'
import groupApplicationsAPI from '@/services/api/groupApplications'
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

export function insertSorted (stateMessages, messages, compareFn) {
  // simple insertion sort for new messages
  // assumes that existing messages are sorted AND incoming messages are sorted
  let i = 0
  for (let message of messages) {
    while (i < stateMessages.length && compareFn(stateMessages[i], message)) i++

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
}

function initialState () {
  return {
    entries: {},
    messages: {}, // { <conversation-id> : [<message>,...] }
    cursors: {}, // { <conversation-id> : [<cursor>, ...]}
    groupConversationIds: {}, // { <group-id> : <conversation-id> }
    pickupConversationIds: {}, // { <pickup-id> : <conversation-id> }
    userConversationIds: {}, // { <user-id> : <conversation-id> }
    applicationConversationIds: {}, // { <application-id> : <conversation-id> }
    latestIds: [],
    latestThreads: [],
  }
}

export default {
  namespaced: true,
  modules: { meta: createMetaModule() },
  state: initialState(),
  getters: {
    get: (state, getters, rootState, rootGetters) => conversationId => {
      const canFetchPast = typeof state.cursors[conversationId] === 'string'
      const conversation = getters.enrichConversation(state.entries[conversationId])
      const messages = (state.messages[conversationId] || []).map(getters.enrichMessage)
      return {
        ...conversation,
        messages,
        canFetchPast,
        ...metaStatusesWithId(getters, ['send', 'fetch', 'fetchPast', 'mark'], conversationId),
      }
    },
    latest: (state, getters) => {
      return state.latestIds.map(getters.get)
    },
    latestThreads: (state, getters) => {
      return state.latestThreads.map(getters.enrichMessage).map(thread => ({
        ...thread,
        latestMessage: thread.latestMessage && getters.enrichMessage(thread.latestMessage),
      }))
    },
    getForGroup: (state, getters) => groupId => {
      const conversationId = state.groupConversationIds[groupId]
      if (!conversationId) return
      return getters.get(conversationId)
    },
    getForPickup: (state, getters) => pickupId => {
      const conversationId = state.pickupConversationIds[pickupId]
      if (!conversationId) return
      return getters.get(conversationId)
    },
    getForUser: (state, getters) => userId => {
      const conversationId = state.userConversationIds[userId]
      if (!conversationId) return
      return getters.get(conversationId)
    },
    getForApplication: (state, getters) => applicationId => {
      const conversationId = state.applicationConversationIds[applicationId]
      if (!conversationId) return
      return getters.get(conversationId)
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
      const isThreadReply = message.thread && message.thread !== message.id
      const data = {
        ...message,
        reactions: getters.enrichReactions(message.reactions),
        author: rootGetters['users/get'](message.author),
        isUnread: isThreadReply
          ? isUnread(message, rootGetters['currentThread/thread'].threadMeta)
          : isUnread(message, state.entries[message.conversation]),
        saveStatus: getters['meta/status']('saveMessage', `message/${message.id}`),
        isEdited: differenceInSeconds(message.updatedAt, message.createdAt) > 10,
      }
      if (data.threadMeta) {
        data.threadMeta = {
          ...data.threadMeta,
          participants: data.threadMeta.participants.map(rootGetters['users/get']),
        }
      }
      return data
    },
    enrichConversation: (state, getters, rootState, rootGetters) => conversation => {
      if (!conversation) return
      const participants = conversation.participants.map(rootGetters['users/get'])

      const { type, targetId } = conversation
      let target = null
      if (type === 'pickup') target = rootGetters['pickups/get'](targetId)
      else if (type === 'private') target = participants.find(u => !u.isCurrentUser)
      return {
        ...conversation,
        participants,
        target,
        latestMessage: conversation.latestMessage && getters.enrichMessage(conversation.latestMessage),
      }
    },
  },
  actions: {
    ...withMeta({
      async send ({ dispatch }, data) {
        if (data.threadId) {
          dispatch('currentThread/send', data, { root: true })
          return
        }

        const message = await messageAPI.create({
          conversation: data.id,
          content: data.content,
        })
        dispatch('receiveMessage', message)
      },
      async fetch ({ commit }, conversationId) {
        const data = await messageAPI.list(conversationId)
        commit('updateMessages', {
          conversationId,
          messages: data.results,
        })
        commit('setCursor', {
          conversationId,
          cursor: data.next,
        })
      },

      async fetchPast ({ state, commit }, conversationId) {
        const currentCursor = state.cursors[conversationId]
        const data = await messageAPI.listMore(currentCursor)
        commit('updateMessages', {
          conversationId,
          messages: data.results,
        })
        commit('setCursor', {
          conversationId,
          cursor: data.next,
        })
      },

      async mark ({ dispatch }, { id, seenUpTo }) {
        await conversationsAPI.mark(id, { seenUpTo })
      },

      async toggleEmailNotifications ({ state, commit }, { id, value }) {
        await conversationsAPI.toggleEmailNotifications(id, value)
        if (state.entries[id]) {
          commit('updateEmailNotifications', { conversationId: id, value })
        }
      },

      async fetchOverview ({ commit, dispatch }, { groupId }) {
        const conversations = (await conversationsAPI.list()).results
        conversations.forEach(conversation => commit('setConversation', { conversation }))
        commit('setLatestIds', conversations)

        conversations.filter(c => c.type === 'pickup').forEach(c => {
          dispatch('pickups/maybeFetch', c.targetId, { root: true })
        })

        const threads = (await messageAPI.listMyThreads()).results
        commit('setLatestThreads', threads)
      },
      async clearOverview ({ commit }) {

      },
    }),

    ...withPrefixedIdMeta('message/', {
      async saveMessage ({ dispatch }, { message, done }) {
        const updatedMessage = await messageAPI.save(message)
        done()
        if (updatedMessage.thread) {
          dispatch('currentThread/receiveMessage', updatedMessage, { root: true })
        }
        if (!updatedMessage.thread || updatedMessage.thread === updatedMessage.id) {
          dispatch('receiveMessage', updatedMessage)
        }
      },
    }, {
      findId: data => data.message.id,
    }),

    async fetchForGroup ({ state, dispatch, commit }, { groupId }) {
      let conversation
      const conversationId = state.groupConversationIds[groupId]
      if (conversationId) conversation = state.entries[conversationId]
      if (!conversation) {
        conversation = await groupsAPI.conversation(groupId)
        commit('setConversation', { conversation, groupId })
      }
      dispatch('fetch', conversation.id)
    },

    clearForGroup ({ state, commit }, { groupId }) {
      const conversationId = state.groupConversationIds[groupId]
      if (conversationId) commit('clearMessages', { conversationId })
    },

    async fetchForPickup ({ state, dispatch, commit }, { pickupId }) {
      let conversation
      const conversationId = state.pickupConversationIds[pickupId]
      if (conversationId) conversation = state.entries[conversationId]
      if (!conversation) {
        conversation = await pickupsAPI.conversation(pickupId)
        commit('setConversation', { conversation, pickupId })
      }
      dispatch('fetch', conversation.id)
    },

    clearForPickup ({ state, commit }, { pickupId }) {
      const conversationId = state.pickupConversationIds[pickupId]
      if (conversationId) commit('clearMessages', { conversationId })
    },

    async fetchForUser ({ state, dispatch, commit }, { userId }) {
      let conversation
      const conversationId = state.userConversationIds[userId]
      if (conversationId) conversation = state.entries[conversationId]
      if (!conversation) {
        conversation = await usersAPI.conversation(userId)
        commit('setConversation', { conversation, userId })
      }
      dispatch('fetch', conversation.id)
    },

    clearForUser ({ state, commit }, { userId }) {
      const conversationId = state.userConversationIds[userId]
      if (conversationId) commit('clearMessages', { conversationId })
    },

    async fetchForApplication ({ state, dispatch, commit }, { applicationId }) {
      let conversation
      // TODO use mapping applicationId -> conversationId from groupApplications module
      let conversationId = state.applicationConversationIds[applicationId]
      if (conversationId) conversation = state.entries[conversationId]
      if (!conversation) {
        // TODO use already loaded application from groupApplications module
        conversationId = (await groupApplicationsAPI.get(applicationId)).conversation
        conversation = await conversationsAPI.get(conversationId)
        commit('setConversation', { conversation, applicationId })
      }
      dispatch('fetch', conversation.id)
    },

    clearForApplication ({ state, commit }, { applicationId }) {
      const conversationId = state.applicationConversationIds[applicationId]
      if (conversationId) commit('clearMessages', { conversationId })
    },

    async maybeToggleEmailNotifications ({ state, getters, dispatch }, { conversationId, threadId, value }) {
      if (threadId) {
        dispatch('currentThread/maybeSetMuted', { threadId, value: !value }, { root: true })
        return
      }
      const pending = getters['meta/status']('toggleEmailNotifications', conversationId).pending
      const prevent = state.entries[conversationId] && state.entries[conversationId].emailNotifications === value
      if (!pending && !prevent) {
        await dispatch('toggleEmailNotifications', { id: conversationId, value })
      }
    },

    async toggleReaction ({ commit, rootGetters }, { message, name }) {
      const { id: messageId, conversation: conversationId } = message
      const userId = rootGetters['auth/userId']
      const reactionIndex = message.reactions.findIndex(reaction => reaction.reacted && reaction.name === name)

      if (reactionIndex === -1) {
        const addedReaction = await reactionsAPI.create(messageId, name)
        if (message.thread) {
          commit('currentThread/addReaction', { messageId, name: addedReaction.name, userId }, { root: true })
        }
        if (!message.thread || message.thread === message.id) {
          commit('addReaction', { conversationId, messageId, name: addedReaction.name, userId })
        }
      }
      else {
        await reactionsAPI.remove(messageId, name)
        if (message.thread) {
          commit('currentThread/removeReaction', { messageId, name, userId }, { root: true })
        }
        if (!message.thread || message.thread === message.id) {
          commit('removeReaction', { conversationId, messageId, name, userId })
        }
      }
    },

    async maybeMark ({ dispatch, getters, rootGetters }, { id, threadId, seenUpTo }) {
      if (id && !getters.get(id).markStatus.pending) {
        dispatch('mark', { id, seenUpTo })
      }
      if (threadId && !rootGetters['currentThread/markStatus'].pending) {
        dispatch('currentThread/mark', { id: threadId, seenUpTo }, { root: true })
      }
    },

    async markAllRead ({ state, dispatch }, conversationId) {
      if (conversationId) {
        const newestMessage = state.messages[conversationId][0]
        dispatch('mark', { id: conversationId, seenUpTo: newestMessage.id })
      }
    },

    clearConversation ({ commit }, conversationId) {
      commit('clearConversation', { conversationId })
    },

    clear ({ commit }) {
      commit('clear')
    },

    receiveMessage ({ commit }, message) {
      commit('updateMessages', {
        messages: [message],
        conversationId: message.conversation,
      })
      if (message.thread) {
        commit('updateLatestThread', message)
      }
    },

    updateConversation ({ state, commit }, conversation) {
      const existing = state.entries[conversation.id]
      if (existing && existing.updatedAt <= conversation.updatedAt) {
        commit('setConversation', { conversation })
      }
    },

    refresh ({ state, dispatch, commit }) {
      Object.keys(state.entries).forEach(async conversationId => {
        dispatch('updateConversation', await conversationsAPI.get(conversationId))
      })
      Object.keys(state.messages).forEach(async conversationId => {
        commit('clearMessages', { conversationId })
        dispatch('fetch', conversationId)
      })
    },
  },
  mutations: {
    clear (state) {
      Object.assign(state, initialState())
    },
    clearMessages (state, { conversationId }) {
      Vue.delete(state.messages, conversationId)
      Vue.delete(state.cursors, conversationId)
    },
    clearConversation (state, { conversationId }) {
      Vue.delete(state.entries, conversationId)
      Vue.delete(state.messages, conversationId)
      Vue.delete(state.cursors, conversationId)
      // TODO: clear entry from state.pickupConversationIds etc
    },
    updateMessages (state, { conversationId, messages }) {
      if (!state.entries[conversationId]) return

      const stateMessages = state.messages[conversationId]
      if (!stateMessages) {
        Vue.set(state.messages, conversationId, messages)
        return
      }
      insertSorted(stateMessages, messages, (a, b) => a.createdAt > b.createdAt)
    },
    setCursor (state, { conversationId, cursor }) {
      Vue.set(state.cursors, conversationId, cursor)
    },
    setConversation (state, { conversation, groupId, pickupId, userId, applicationId }) {
      Vue.set(state.entries, conversation.id, conversation)
      if (groupId) {
        Vue.set(state.groupConversationIds, groupId, conversation.id)
      }
      if (pickupId) {
        Vue.set(state.pickupConversationIds, pickupId, conversation.id)
      }
      if (userId) {
        Vue.set(state.userConversationIds, userId, conversation.id)
      }
      if (applicationId) {
        Vue.set(state.applicationConversationIds, applicationId, conversation.id)
      }
    },
    setLatestIds (state, conversations) {
      state.latestIds = conversations.map(c => c.id)
    },
    setLatestThreads (state, threads) {
      state.latestThreads = threads
    },
    updateLatestThread (state, thread) {
      const idx = state.latestThreads.findIndex(t => t.id === thread.id)
      Vue.set(state.latestThreads, idx, thread)
    },
    updateEmailNotifications (state, { conversationId, value }) {
      state.entries[conversationId].emailNotifications = value
    },
    addReaction (state, { userId, name, messageId, conversationId }) {
      if (!state.messages[conversationId]) return
      const message = state.messages[conversationId].find(message => message.id === messageId)
      message.reactions.push({ user: userId, name })
    },
    removeReaction (state, { userId, name, messageId, conversationId }) {
      if (!state.messages[conversationId]) return
      const message = state.messages[conversationId].find(message => message.id === messageId)
      const reactionIndex = message.reactions.findIndex(reaction => reaction.user === userId && reaction.name === name)
      message.reactions.splice(reactionIndex, 1)
    },
  },
}
