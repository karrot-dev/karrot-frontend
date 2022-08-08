/* eslint-disable */

import { useMutation, useQueryClient } from 'vue-query'
import { withStatus } from '@/utils/queryHelpers'
import conversationsAPI from '@/messages/api/conversations'
import messagesAPI from '@/messages/api/messages'
import reactionsAPI from '@/messages/api/reactions'
import { queryKeyMessageList } from '@/messages/queries'

export function useSendMessageMutation () {
  return withStatus(useMutation(
    ({ id, content, images, threadId }) => messagesAPI.create({
      conversation: id,
      thread: threadId, // optional
      content,
      images,
    }),
    // relies on websockets to update data
  ))
}

export function useSaveMesssageMutation () {
  return withStatus(useMutation(message => messagesAPI.save(message)))
}

export function useSaveConversationMutation () {
  // TODO: this id, value thing is odd, but just recreating what the datastore does, should change it to just save normally...
  return withStatus(useMutation(({ id, value }) => conversationsAPI.save(id, value)))
}

export function useConversationSeenUpToMutation () {
  return withStatus(useMutation(
    ({ conversationId, messageId }) => conversationsAPI.save(conversationId, { seenUpTo: messageId }),
  ))
}

export function useThreadSeenUpToMutation () {
  return withStatus(useMutation(
    ({ threadId, messageId }) => messagesAPI.markThread(threadId, messageId),
  ))
}

export function useAddReactionMutation () {
  return withStatus(useMutation(({ messageId, name }) => reactionsAPI.create(messageId, name)))
}

export function useRemoveReactionMutation () {
  return withStatus(useMutation(({ messageId, name }) => reactionsAPI.remove(messageId, name)))
}
