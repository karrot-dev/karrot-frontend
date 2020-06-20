import Vue from 'vue'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import messageAPI from '@/messages/api/messages'
import conversationsAPI from '@/messages/api/conversations'
import reactionsAPI from '@/messages/api/reactions'
import activitiesAPI from '@/activities/api/activities'
import usersAPI from '@/users/api/users'
import groupsAPI from '@/group/api/groups'
import issuesAPI from '@/issues/api/issues'
import placesAPI from '@/places/api/places'
import applicationsAPI from '@/applications/api/applications'
import offersAPI from '@/offers/api/offers'
import i18n from '@/base/i18n'
import { createMetaModule, withMeta, withPrefixedIdMeta, metaStatusesWithId } from '@/utils/datastore/helpers'

export function isUnread (message, conversation) {
  if (!message || !conversation) return
  if (conversation.notifications === 'none') {
    // don't show unread status if user is not participant
    // does not apply to thread replies
    return false
  }
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

export function insertSorted (source, items, oldestFirst = false) {
  // simple sorted list insertion
  // assumes that existing messages are sorted AND incoming messages are sorted
  // don't modify in-place to minimize expensive operations on reactive arrays
  const target = [...source]
  const compare = oldestFirst ? (a, b) => a.id < b.id : (a, b) => a.id > b.id
  let i = 0
  for (const item of items) {
    while (i < target.length && compare(target[i], item)) i++

    // decide if we should append, update or insert an item
    if (i >= target.length) {
      target.push(item)
    }
    else if (target[i].id === item.id) {
      target[i] = item
    }
    else {
      target.splice(i, 0, item)
    }
  }
  return target
}

function initialState () {
  return {
    entries: {},
    messages: {}, // { <conversation-id> : [<message>,...] }
    cursors: {}, // { <conversation-id> : [<cursor>, ...]}
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
    getForType: (state, getters) => (myType, myId) => {
      const { id } = Object.values(state.entries).find(({ type, targetId }) => type === myType && targetId === myId) || {}
      if (!id) return
      return getters.get(id)
    },
    getForGroup: (state, getters) => groupId => getters.getForType('group', groupId),
    getForPlace: (state, getters) => placeId => getters.getForType('place', placeId),
    getForActivity: (state, getters) => activityId => getters.getForType('pickup', activityId),
    getForApplication: (state, getters) => applicationId => getters.getForType('application', applicationId),
    getForIssue: (state, getters) => issueId => getters.getForType('issue', issueId),
    getForOffer: (state, getters) => offerId => getters.getForType('offer', offerId),
    getForUser: (state, getters) => userId => {
      const { id } = Object.values(state.entries).find(({ type, participants }) => type === 'private' && participants.includes(userId)) || {}
      if (!id) return
      return getters.get(id)
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
      const isUnreadIfThreadParticipant = (message) => {
        // Show as read if user is not thread participant,
        // as non-participants can't mark messages read

        // TODO: what if message is not part of currentThread?
        const threadMeta = rootGetters['currentThread/thread'].threadMeta
        if (!threadMeta) return false

        const isParticipant = Boolean(threadMeta.participants.find(u => u.isCurrentUser))
        if (!isParticipant) return false

        return isUnread(message, threadMeta)
      }

      const conversation = state.entries[message.conversation]
      const data = {
        ...message,
        reactions: getters.enrichReactions(message.reactions),
        author: rootGetters['users/get'](message.author),
        isUnread: isThreadReply
          ? isUnreadIfThreadParticipant(message)
          : isUnread(message, state.entries[message.conversation]),
        saveStatus: getters['meta/status']('saveMessage', `message/${message.id}`),
        isEdited: differenceInSeconds(message.editedAt, message.createdAt) > 30,
        groupId: conversation && conversation.group,
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
      const isParticipant = conversation.notifications !== 'none'
      const enriched = {
        ...conversation,
        participants,
        isParticipant,
        muted: conversation.notifications === 'muted',
        unreadMessageCount: isParticipant ? conversation.unreadMessageCount : 0,
      }
      enriched.target = getters.getTarget(enriched)
      return enriched
    },
    getTarget: (state, getters, rootState, rootGetters) => conversation => {
      const { type, targetId, participants } = conversation
      switch (type) {
        case 'group': return rootGetters['groups/get'](targetId)
        case 'place': return rootGetters['places/get'](targetId)
        case 'pickup': return rootGetters['activities/get'](targetId)
        case 'application': return rootGetters['applications/get'](targetId)
        case 'issue': return rootGetters['issues/get'](targetId)
        case 'offer': return rootGetters['latestMessages/getRelated']('offer', targetId)
        case 'private': return participants.find(u => !u.isCurrentUser)
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
      async fetch ({ commit, dispatch }, conversationId) {
        const data = await messageAPI.list(conversationId)
        const messages = data.results
        commit('updateMessages', {
          conversationId,
          messages,
        })
        commit('setCursor', {
          conversationId,
          cursor: data.next,
        })

        dispatch('fetchRelatedUserInfo', messages)
      },

      async fetchPast ({ state, commit, dispatch }, conversationId) {
        const currentCursor = state.cursors[conversationId]
        const data = await messageAPI.listMore(currentCursor)
        const messages = data.results
        commit('updateMessages', {
          conversationId,
          messages,
        })
        commit('setCursor', {
          conversationId,
          cursor: data.next,
        })

        dispatch('fetchRelatedUserInfo', messages)
      },

      async fetchRelatedUserInfo ({ dispatch }, messages) {
        const authorIds = messages.map(m => m.author)
        dispatch('users/maybeFetchInfo', authorIds, { root: true })
      },

      async fetchConversation ({ dispatch }, id) {
        dispatch('updateConversation', await conversationsAPI.get(id))
      },

      async mark ({ dispatch }, { id, seenUpTo }) {
        await conversationsAPI.save(id, {
          seenUpTo,
        })
      },

      async save ({ state }, { id, value }) {
        await conversationsAPI.save(id, value)
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

    async fetchForGroup ({ dispatch }, { groupId }) {
      const conversation = await dispatch('fetchGroupConversation', groupId)
      dispatch('fetch', conversation.id)
    },

    async fetchGroupConversation ({ getters, commit }, groupId) {
      let conversation = getters.getForGroup(groupId)
      if (!conversation) {
        conversation = await groupsAPI.conversation(groupId)
        commit('setConversation', conversation)
      }
      return conversation
    },

    clearForGroup ({ getters, commit }, { groupId }) {
      const { id: conversationId } = getters.getForGroup(groupId) || {}
      if (conversationId) commit('clearMessages', conversationId)
    },

    async fetchForPlace ({ dispatch }, { placeId }) {
      const conversation = await dispatch('fetchPlaceConversation', placeId)
      dispatch('fetch', conversation.id)
    },

    async fetchPlaceConversation ({ getters, commit }, placeId) {
      let conversation = getters.getForPlace(placeId)
      if (!conversation) {
        conversation = await placesAPI.conversation(placeId)
        commit('setConversation', conversation)
      }
      return conversation
    },

    clearForPlace ({ getters, commit }, { placeId }) {
      const { id: conversationId } = getters.getForPlace(placeId) || {}
      if (conversationId) commit('clearMessages', conversationId)
    },

    async fetchForActivity ({ getters, dispatch, commit }, { activityId }) {
      let conversation = getters.getForActivity(activityId)
      if (!conversation) {
        conversation = await activitiesAPI.conversation(activityId)
        commit('setConversation', conversation)
      }
      dispatch('fetch', conversation.id)
    },

    clearForActivity ({ getters, commit }, { activityId }) {
      const { id: conversationId } = getters.getForActivity(activityId) || {}
      if (conversationId) commit('clearMessages', conversationId)
    },

    async fetchForUser ({ getters, dispatch, commit }, { userId }) {
      let conversation = getters.getForUser(userId)
      if (!conversation) {
        conversation = await usersAPI.conversation(userId)
        commit('setConversation', conversation)
      }
      dispatch('fetch', conversation.id)
    },

    clearForUser ({ getters, commit }, { userId }) {
      const { id: conversationId } = getters.getForActivity(userId) || {}
      if (conversationId) commit('clearMessages', conversationId)
    },

    async fetchForApplication ({ commit, getters, dispatch }, { applicationId }) {
      let conversation = getters.getForApplication(applicationId)
      if (!conversation) {
        conversation = await applicationsAPI.conversation(applicationId)
        commit('setConversation', conversation)
      }
      dispatch('fetch', conversation.id)
    },

    clearForApplication ({ getters, commit }, { applicationId }) {
      const { id: conversationId } = getters.getForApplication(applicationId) || {}
      if (conversationId) commit('clearMessages', conversationId)
    },

    async fetchForIssue ({ commit, getters, dispatch }, { issueId }) {
      let conversation = getters.getForIssue(issueId)
      if (!conversation) {
        conversation = await issuesAPI.conversation(issueId)
        commit('setConversation', conversation)
      }
      dispatch('fetch', conversation.id)
    },

    async fetchForOffer ({ commit, getters, dispatch }, { offerId }) {
      let conversation = getters.getForOffer(offerId)
      if (!conversation) {
        conversation = await offersAPI.conversation(offerId)
        commit('setConversation', conversation)
      }
      dispatch('fetch', conversation.id)
    },

    clearForIssue ({ getters, commit }, { issueId }) {
      const { id: conversationId } = getters.getForIssue(issueId) || {}
      if (conversationId) commit('clearMessages', conversationId)
    },

    async maybeSave ({ getters, dispatch }, { conversationId, threadId, value }) {
      if (threadId) {
        if (!value.notifications) return
        const muted = value.notifications !== 'all'
        dispatch('currentThread/maybeSetMuted', { threadId, value: muted }, { root: true })
        return
      }
      const pending = getters['meta/status']('save', conversationId).pending
      if (!pending) {
        await dispatch('save', { id: conversationId, value })
      }
    },

    ...withMeta({
      async toggleReaction (_, { message, name }) {
        const { id: messageId } = message
        const reactionIndex = message.reactions.findIndex(reaction => reaction.reacted && reaction.name === name)

        if (reactionIndex === -1) {
          await reactionsAPI.create(messageId, name)
        }
        else {
          await reactionsAPI.remove(messageId, name)
        }
      },
    }),

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

    receiveMessage ({ commit }, message) {
      commit('updateMessages', {
        messages: [message],
        conversationId: message.conversation,
      })
    },

    updateConversation ({ state, commit }, conversation) {
      const existing = state.entries[conversation.id]
      if (!existing || existing.updatedAt <= conversation.updatedAt) {
        commit('setConversation', conversation)
      }
    },

    maybeFetchConversation ({ state, dispatch, getters }, id) {
      const { pending } = getters['meta/status']('fetchConversation', id)
      const { entries } = state
      if (entries[id] || pending) return
      dispatch('fetchConversation', id)
    },

    refresh ({ state, dispatch }) {
      Object.keys(state.entries).forEach(async conversationId => {
        conversationId = parseInt(conversationId)
        dispatch('fetchConversation', conversationId)
      })
      Object.keys(state.messages).forEach(async conversationId => {
        conversationId = parseInt(conversationId)
        // refreshes only first page of messages and resets pagination cursor
        dispatch('fetch', conversationId)
      })
    },
  },
  mutations: {
    clear (state) {
      Object.assign(state, initialState())
    },
    clearMessages (state, conversationId) {
      Vue.delete(state.messages, conversationId)
      Vue.delete(state.cursors, conversationId)
    },
    clearConversation (state, conversationId) {
      Vue.delete(state.entries, conversationId)
      Vue.delete(state.messages, conversationId)
      Vue.delete(state.cursors, conversationId)
    },
    updateMessages (state, { conversationId, messages }) {
      if (!state.entries[conversationId]) return
      const stateMessages = state.messages[conversationId]
      Vue.set(
        state.messages,
        conversationId,
        Object.freeze(stateMessages ? insertSorted(stateMessages, messages) : messages),
      )
    },
    setCursor (state, { conversationId, cursor }) {
      Vue.set(state.cursors, conversationId, cursor)
    },
    setConversation (state, conversation) {
      Vue.set(state.entries, conversation.id, Object.freeze(conversation))
    },
  },
}

export const plugin = datastore => {
  datastore.watch((state, getters) => getters['auth/isLoggedIn'], isLoggedIn => {
    if (!isLoggedIn) {
      datastore.commit('conversations/clear')
    }
  })
}
