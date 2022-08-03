/* eslint-disable */

import { useMutation, useQueryClient } from 'vue-query'
import { withStatus } from '@/utils/queryHelpers'
import messageAPI from '@/messages/api/messages'
import { queryKeyMessageList } from '@/messages/queries'

export function useSendMessageMutation () {
  const queryClient = useQueryClient()
  return withStatus(useMutation(
    ({ id, content, images, threadId }) => messageAPI.create({
      conversation: id,
      thread: threadId, // optional
      content,
      images,
    }),
    {
      onSuccess (message) {
        // TODO: do this, or rely on websockets to do it?
        // queryClient.invalidateQueries(queryKeyMessageList({ conversationId: message.conversation }))
      },
    },
  ))
}
