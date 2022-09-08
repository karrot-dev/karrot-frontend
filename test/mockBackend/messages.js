import { faker } from '@faker-js/faker'

import { cursorPaginated, post } from './mockAxios'

import { ctx, db } from './index'

let nextId = 1
export function generateMessage (params = {}) {
  return {
    id: nextId++,
    author: null,
    content: faker.random.words(20),
    conversation: null,
    createdAt: new Date(),
    updatedAt: new Date(),
    editedAt: null,
    reactions: [],
    receivedVia: '',
    isEditable: false, // TODO might be true if authUser===author
    thread: null,
    threadMeta: null,
    images: [],
    ...params,
  }
}

export function createMockMessagesBackend () {
  cursorPaginated(
    '/api/messages/',
    ({ params }) => db.messages.filter(message => {
      /* TODO add message filters by conversation, authuser
      */

      return true
    }),
  )

  post(
    '/api/messages/',
    ({ data }) => {
      // TODO implement more valiation errors
      if (!data.conversation) return [400, 'must pass a conversation']
      const message = generateMessage({
        author: ctx.authUser.id,
        content: data.content,
        conversation: data.conversation,
        // TODO handle threads and images
      })
      db.messages.push(message)
      return [200, message]
    },
  )
}
