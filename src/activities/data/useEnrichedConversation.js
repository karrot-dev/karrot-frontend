import { sortByName } from '@/messages/datastore/conversations'
import { useEnrichedUsers } from '@/activities/data/useUsers'
import i18n from '@/base/i18n'
import differenceInSeconds from 'date-fns/differenceInSeconds'
import { unref, computed } from '@vue/composition-api'

export function useEnrichedConversation (conversationRef, messagesRef, { authUserId, getUser }) {
  const { enrichUser } = useEnrichedUsers({ authUserId })

  function enrichConversation (conversation) {
    if (!conversation) return
    const participants = conversation.participants.map(getUser).map(enrichUser)
    const isParticipant = conversation.notifications !== 'none'
    const enrichedConversation = {
      ...conversation,
      participants,
      isParticipant,
      muted: conversation.notifications === 'muted',
      unreadMessageCount: isParticipant ? conversation.unreadMessageCount : 0,
    }
    // TODO: how to find these!
    // enriched.target = getters.getTarget(enriched)
    return enrichedConversation
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
      const user = enrichUser(getUser(reaction.user))
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

  function isUnread (message, conversation) {
    if (!message || !conversation) return
    if (conversation.notifications === 'none') {
      // don't show unread status if user is not participant
      // does not apply to thread replies
      return false
    }
    if (!conversation.seenUpTo) return true
    return message.id > conversation.seenUpTo
  }

  function enrichMessage (message) {
    if (!message) return
    const conversation = unref(conversationRef)
    if (!conversation || message.conversation !== conversation.id) return

    const isThreadReply = message.thread && message.thread !== message.id
    const isUnreadIfThreadParticipant = (message) => {
      // Show as read if user is not thread participant,
      // as non-participants can't mark messages read

      // TODO: what if message is not part of currentThread?
      // TODO: not implemented yet!
      // eslint-disable-next-line no-undef
      const threadMeta = rootGetters['currentThread/thread'].threadMeta
      if (!threadMeta) return false

      const isParticipant = Boolean(threadMeta.participants.find(u => u.isCurrentUser))
      if (!isParticipant) return false

      return isUnread(message, threadMeta)
    }

    const user = getUser(message.author)
    // console.log('got message user!', user, isReactive(user), 'user id is', user.id, 'displayname', String(user.displayName))
    const enrichedMessage = {
      ...message,
      reactions: enrichReactions(message.reactions),
      user,
      author: enrichUser(user),
      isUnread: isThreadReply
        ? isUnreadIfThreadParticipant(message)
        : isUnread(message, conversation),
      saveStatus: {}, // TODO: status will go elsewhere
      isEdited: differenceInSeconds(message.editedAt, message.createdAt) > 30,
      groupId: conversation && conversation.group,
    }
    if (enrichedMessage.threadMeta) {
      enrichedMessage.threadMeta = {
        ...enrichedMessage.threadMeta,
        participants: enrichedMessage.threadMeta.participants.map(getUser).map(enrichUser),
      }
    }
    return enrichedMessage
  }

  return {
    enrichedConversation: computed(() => enrichConversation(unref(conversationRef))),
    enrichedMessages: computed(() => unref(messagesRef).map(enrichMessage)),
  }
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
