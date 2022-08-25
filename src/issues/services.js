import { readonly } from 'vue'

import { useConversationAndMessages } from '@/messages/services'
import { useIntegerRouteParam } from '@/utils/composables'
import { defineService } from '@/utils/datastore/helpers'

import { useIssueDetailQuery } from './queries'

export const useActiveIssueService = defineService(() => {
  const issueId = useIntegerRouteParam('issueId')

  const { issue } = useIssueDetailQuery({ issueId })

  const {
    conversation,
    messages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useConversationAndMessages(
    { issueId },
    // TODO: should issue messages be this way or oldest-first?
    { order: 'newest-first' },
  )

  return {
    issueId: readonly(issueId),
    issue,
    conversation,
    messages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }
})
