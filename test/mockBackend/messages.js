import { faker } from '@faker-js/faker'

import {cursorPaginated, getById, post} from './mockAxios'

import { ctx, db } from './index'

let nextAttachmentId = 1

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
    attachments: [],
    ...params,
  }
}

function generateAttachment (params = {}) {
  return {
    id: nextAttachmentId++,
    ...params,
  }
}

function toResponse (message) {
  return {
    ...message,
    attachments: (message.attachments ?? []).map(attachment => ({
      ...attachment,
      urls: {
        download: `/api/attachments/${attachment.id}/download/`,
        original: `/api/attachments/${attachment.id}/original/`,
      },
    })),
  }
}

export function createMockMessagesBackend () {
  cursorPaginated(
    '/api/messages/',
    ({ params }) => db.messages.filter(message => {
      /* TODO add message filters by conversation, authuser
      */

      return true
    }).map(toResponse),
  )

  function allAttachmentFiles () {
    return db.messages
      .map(message => message.attachments)
      .flat()
      .map(attachment => attachment.file)
  }

  getById('/api/attachments/:id/download/', allAttachmentFiles)
  getById('/api/attachments/:id/original/', allAttachmentFiles)

  post(
    '/api/messages/',
    ({ data }) => {
      // TODO implement more valiation errors
      if (!data.conversation) return [400, 'must pass a conversation']
      const message = generateMessage({
        author: ctx.authUser.id,
        content: data.content,
        conversation: data.conversation,
        attachments: (data.attachments ?? []).map(generateAttachment),
        // TODO handle threads and images
      })
      db.messages.push(message)
      return [200, toResponse(message)]
    },
  )
}
