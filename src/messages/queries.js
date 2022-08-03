import { unref, computed } from 'vue'

import messageAPI from '@/messages/api/messages'
import groupsAPI from '@/group/api/groups'
import { useInfiniteQuery, useQuery, useQueryClient } from 'vue-query'
import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'
import { useSocketEvents } from '@/utils/composables'

export const QUERY_KEY_BASE = 'messages'
export const queryKeyConversation = params => [QUERY_KEY_BASE, 'conversation', params].filter(Boolean)
export const queryKeyMessageList = params => [QUERY_KEY_BASE, 'list', params].filter(Boolean)

export function useConversationUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on(
    'conversations:conversation',
    conversation => {
      // TODO: consider doing more refined updates
      // invalidating all the conversations! could probably do a filter with a predicate that we peek inside...
      // queryClient.invalidateQueries(queryKeyConversation())
      queryClient.setQueriesData({
        queryKey: queryKeyConversation(),
        predicate: query => {
          console.log('checking if to update?', conversation, query)
          return query.state.data && query.state.data.id === conversation.id
        },
      }, oldValue => {
        console.log('updating convo', oldValue, '->', conversation)
        return conversation
      })
    },
  )
}

export function useMessageUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on(
    'conversations:message',
    message => {
      // TODO: consider doing more refined updates
      queryClient.invalidateQueries(queryKeyMessageList({ conversationId: message.conversation }))
    },
  )
}

export function useConversationQuery ({ groupId }) {
  const query = useQuery(
    // Hmmm, we can't store it by conversation id, as we don't know it yet...
    queryKeyConversation({ groupId }),
    () => {
      if (groupId.value) {
        return groupsAPI.conversation(unref(groupId))
      }
    },
    {
      enabled: computed(() => Boolean(unref(groupId))),
    },
  )
  return {
    ...query,
    conversation: query.data,
  }
}

export function useMessageListQuery ({ conversationId }) {
  const query = useInfiniteQuery(
    queryKeyMessageList({ conversationId }),
    ({ pageParam }) => messageAPI.list(unref(conversationId), pageParam),
    {
      // load on demand... TODO: consider a bit more...
      cacheTime: 0,
      staleTime: 0,
      enabled: computed(() => Boolean(unref(conversationId))),
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => page.results),
        pageParams,
      }),
    },
  )
  return {
    ...query,
    messages: flattenPaginatedData(query),
  }
}
