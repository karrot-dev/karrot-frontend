import { ctx } from '>/mockBackend/index'

let nextId = 1
export function generateConversation (params = {}) {
  if (params.participants) throw new Error('must add participants with addUserToConversation')

  return {
    id: nextId++,
    participants: {},
    group: null,
    updatedAt: new Date(),
    type: null,
    targetId: null,
    isClosed: false,
    ...params,
  }
}

export function toResponse (conversation) {
  const { participants } = conversation
  return {
    ...conversation,
    ...participants[ctx.authUser.id],
    participants: Object.keys(participants).map(key => parseInt(key)),
  }
}

export function addUserToConversation (user, conversation) {
  conversation.participants[user.id] = {
    seenUpTo: null,
    unreadMessageCount: 0,
    notifications: 'all',
  }
}
