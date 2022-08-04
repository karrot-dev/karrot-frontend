/* eslint-disable */

import { useUserService } from '@/users/services'
import { useUserEnricher } from '@/users/enrichers'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { isUnread, readableReactionMessage, sortByName } from '@/messages/datastore/conversations'
import { useQueryClient } from 'vue-query'
import { queryKeyConversation, queryKeyMessageList } from '@/messages/queries'
import { createInstrument } from '@/boot/performance'

const instrumentEnrichMessage = createInstrument('new: enrich message')

export function useConversationEnricher () {
  const { getUserById } = useUserService()
  const enrichUser = useUserEnricher()
  function enrichConversation (conversation) {
    const participants = conversation.participants.map(getUserById).map(enrichUser) // TODO: do I need to enrich the users?
    const isParticipant = conversation.notifications !== 'none'
    return {
      ...conversation,
      participants,
      isParticipant,
      muted: conversation.notifications === 'muted',
      unreadMessageCount: isParticipant ? conversation.unreadMessageCount : 0,
    }
  }
  return enrichConversation
}

/*
reactions: enrichReactions(message.reactions),
      author: getUserById(message.author), // TODO: enrich author too?
      isEdited: differenceInSeconds(message.editedAt, message.createdAt) > 30,
      isUnread: isThreadReply
        ? isUnreadIfThreadParticipant(message)
        : isUnread(message, conversation),
      groupId: conversation?.group,
      ...(message.threadMeta ? {
        threadMeta: {
          ...message.threadMeta,
          participants: message.threadMeta.participants.map(getUserById), // TODO: enrich these users?
        }
      } : {}),
 */

export function useMessageEnricher () {
  const queryClient = useQueryClient()
  const { getUserById } = useUserService()
  const enrichUser = useUserEnricher()

  function findConversation (conversationId) {
    // They query keys don't have the conversation id in, but we can look through our cache...
    // ... not sure if this is a good idea...
    const conversationsData = queryClient.getQueriesData(queryKeyConversation())
    try {
      return conversationsData.find(([_, conversationData]) => conversationData?.id === conversationId)?.[1]
    }
    catch (error) {
      console.error(error)
      return null
    }
  }

  function findThreadMeta (message) {
    // Look through the messages to find a message with this id...
    // TODO: not sure if this is right...
    try {
      const messages = queryClient.getQueryData(queryKeyMessageList(message.conversation))
      console.log('looking for thread meta for', message, 'in', messages)
    }
    catch (error) {
      console.error(error)
      return null
    }
  }

  function enrichReactions (reactions) {
    if (!reactions || !reactions.length) return []
    const groupedReactions = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.name]) {
        acc[reaction.name] = {
          name: reaction.name,
          users: [],
          reacted: false,
        }
      }
      const user = enrichUser(getUserById(reaction.user))
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
  }

  function enrichMessage (message) {
    const isThreadReply = message.thread && message.thread !== message.id

    const isUnreadIfThreadParticipant = (message) => {
      // Show as read if user is not thread participant,
      // as non-participants can't mark messages read

      // TODO: what if message is not part of currentThread?
      const threadMeta = findThreadMeta(message) // TODO: where to get my thread meta? rootGetters['currentThread/thread'].threadMeta
      if (!threadMeta) return false

      const isParticipant = Boolean(threadMeta.participants.find(u => u.isCurrentUser))
      if (!isParticipant) return false

      return isUnread(message, threadMeta)
    }
    /*
     */

    const conversation = findConversation(message.conversation)

    return {
      ...message,
      _enrichSource: message,

      reactions: enrichReactions(message.reactions),
      author: getUserById(message.author), // TODO: enrich author too?
      isEdited: differenceInSeconds(message.editedAt, message.createdAt) > 30,
      isUnread: isThreadReply
        ? isUnreadIfThreadParticipant(message)
        : isUnread(message, conversation),
      groupId: conversation?.group,
      ...(message.threadMeta ? {
        threadMeta: {
          ...message.threadMeta,
          participants: message.threadMeta.participants.map(getUserById), // TODO: enrich these users?
        }
      } : {}),
    }

    /*
    // const conversation = state.entries[message.conversation]
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
     */
  }

  return instrumentEnrichMessage(enrichMessage)
}
