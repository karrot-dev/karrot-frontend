import differenceInSeconds from 'date-fns/differenceInSeconds'

import { useAuthHelpers } from '@/authuser/helpers'
import i18n from '@/base/i18n'
import { useUserService } from '@/users/services'

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
  const { getIsCurrentUser } = useAuthHelpers()
  const { getUserById } = useUserService()

  function readableReactionMessage (reaction) {
    if (!reaction.users.length) return ''
    const users = reaction.users.map(getUserById)
    // form the message which users reacted
    // i.e. "foo, bar and baz reacted with heart"
    const names = users.filter(user => !getIsCurrentUser(user)).map(u => u.displayName)
    if (names.length !== users.length) {
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

  function getIsPartOfThread (message) {
    return Boolean(message.thread)
  }

  function getIsThreadReply (message) {
    return message.thread && message.thread !== message.id
  }

  function getIsMessageEdited (message) {
    return differenceInSeconds(message.editedAt, message.createdAt) > 30
  }

  return {
    getIsMessageEdited,
    getIsThreadReply,
    getIsPartOfThread,
    groupReactions,
  }
}
