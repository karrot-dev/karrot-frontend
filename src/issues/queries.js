import { computed, unref } from 'vue'
import { useInfiniteQuery, useQuery, useQueryClient } from 'vue-query'

import api from '@/issues/api/issues'
import { paginationHelpers } from '@/messages/queries'
import { useSocketEvents } from '@/utils/composables'
import { extractCursor, flattenPaginatedData, useQueryHelpers } from '@/utils/queryHelpers'

export const QUERY_KEY_BASE = 'issues'
export const queryKeyIssueList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)
export const queryKeyIssueDetail = issueId => [QUERY_KEY_BASE, 'detail', issueId].filter(Boolean)

export function useIssuesUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  const { maybeUpdateDataWith } = useQueryHelpers()
  on('issues:issue', updatedIssue => {
    queryClient.setQueryData(
      queryKeyIssueDetail(updatedIssue.id),
      maybeUpdateDataWith(updatedIssue),
    )

    let updated = false
    queryClient.setQueriesData(
      queryKeyIssueList(),
      maybeUpdateDataWith(updatedIssue, () => {
        updated = true
      }),
    )
    if (!updated) {
      queryClient.invalidateQueries(queryKeyIssueList())
    }
  })
}

export function useIssueListQuery ({ groupId, status }) {
  const query = useInfiniteQuery(
    queryKeyIssueList({ groupId, status }),
    ({ pageParam }) => api.list({
      group: unref(groupId),
      status: unref(status),
      cursor: pageParam,
    }),
    {
      enabled: computed(() => Boolean(unref(groupId))), // group is required
      // TODO: explore these more
      cacheTime: 1000,
      staleTime: 0,
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => page.results),
        pageParams,
      }),
    },
  )
  return {
    ...query,
    ...paginationHelpers(query),
    issues: flattenPaginatedData(query),
  }
}

export function useIssueDetailQuery ({ issueId }) {
  const query = useQuery(
    queryKeyIssueDetail(issueId),
    () => api.get(unref(issueId)),
    {
      enabled: computed(() => Boolean(unref(issueId))),
    },
  )
  return {
    ...query,
    issue: query.data,
  }
}
