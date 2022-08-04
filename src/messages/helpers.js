import { useQueryClient } from 'vue-query'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { queryKeyConversation, queryKeyMessageList } from '@/messages/queries'
import i18n from '@/base/i18n'
import { useAuthHelpers } from '@/authuser/helpers'

export function sortByName (a, b) {
  return a.name.localeCompare(b.name)
}

export function useConversationHelpers () {
  function getIsParticipant (conversation) {
    return conversation?.notifications !== 'none' ?? false
  }

  function getIsMuted (conversation) {
    return conversation?.notifications === 'muted' ?? false
  }

  function getUnreadMessageCount (conversation) {
    return conversation && getIsParticipant(conversation) ? conversation.unreadMessageCount : 0
  }

  return {
    getIsParticipant,
    getIsMuted,
    getUnreadMessageCount,
  }
}

export function useMessageHelpers () {
  const queryClient = useQueryClient()
  const { getIsCurrentUser } = useAuthHelpers()

  function readableReactionMessage (reaction) {
    if (!reaction.users.length) return ''
    // form the message which users reacted
    // i.e. "foo, bar and baz reacted with heart"
    const names = reaction.users.filter(user => !getIsCurrentUser(user)).map(u => u.displayName)
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

  function groupReactions (reactions) {
    if (!reactions || !reactions.length) return []
    const groupedReactions = reactions.reduce((acc, reaction) => {
      if (!acc[reaction.name]) {
        acc[reaction.name] = {
          name: reaction.name,
          users: [],
          reacted: false,
        }
      }
      const user = reaction.user
      acc[reaction.name].users.push(user)
      if (getIsCurrentUser(user)) {
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

  function isThreadReply (message) {
    return message.thread && message.thread !== message.id
  }

  function isMessageEdited (message) {
    return differenceInSeconds(message.editedAt, message.createdAt) > 30
  }

  function isUnread (message, conversationOrThreadMeta) {
    if (!message || !conversationOrThreadMeta) return
    if (conversationOrThreadMeta.notifications === 'none') {
      // don't show unread status if user is not participant
      // does not apply to thread replies
      return false
    }
    if (!conversationOrThreadMeta.seenUpTo) return true
    return message.id > conversationOrThreadMeta.seenUpTo
  }

  function isMessageUnread (message) {
    return isThreadReply(message)
      ? isUnreadIfThreadParticipant(message)
      : isUnread(message, findConversation(message.conversation))
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

  function isUnreadIfThreadParticipant (message) {
    // Show as read if user is not thread participant,
    // as non-participants can't mark messages read

    // TODO: what if message is not part of currentThread?
    const threadMeta = findThreadMeta(message) // TODO: where to get my thread meta? rootGetters['currentThread/thread'].threadMeta
    if (!threadMeta) return false

    const isParticipant = Boolean(threadMeta.participants.find(user => getIsCurrentUser(user)))
    if (!isParticipant) return false

    return isUnread(message, threadMeta)
  }

  function findConversation (conversationId) {
    // They query keys don't have the conversation id in, but we can look through our cache...
    // ... not sure if this is a good idea... I don't think it's reactive...
    const conversationsData = queryClient.getQueriesData(queryKeyConversation())
    try {
      return conversationsData.find(([_, conversationData]) => conversationData?.id === conversationId)?.[1]
    }
    catch (error) {
      console.error(error)
      return null
    }
  }

  return {
    isMessageEdited,
    isMessageUnread,
    isThreadReply,
    groupReactions,
  }
}
