import { unref, computed } from 'vue'

import messageAPI from '@/messages/api/messages'
import groupsAPI from '@/group/api/groups'
import placesAPI from '@/places/api/places'
import { useInfiniteQuery, useQuery, useQueryClient } from 'vue-query'
import { extractCursor, flattenPaginatedData } from '@/utils/queryHelpers'
import { useSocketEvents } from '@/utils/composables'
import { useMessageHelpers } from '@/messages/helpers'

export const QUERY_KEY_BASE = 'messages'
export const queryKeyConversation = params => [QUERY_KEY_BASE, 'conversation', params].filter(Boolean)
export const queryKeyMessageList = conversationId => [QUERY_KEY_BASE, 'list', conversationId].filter(Boolean)
export const queryKeyMessageThreadList = messageId => [QUERY_KEY_BASE, 'thread', 'list', messageId].filter(Boolean)
export const queryKeyMessageItem = messageId => [QUERY_KEY_BASE, 'message', messageId].filter(Boolean)

export function useConversationUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  // TODO: also update on 'conversations:meta' ? need to implement the meta thing...
  on(
    'conversations:conversation',
    conversation => {
      // The conversations are not stored by conversation id, so we have to look through the data to find matching ones
      queryClient.setQueriesData({
        queryKey: queryKeyConversation(),
        predicate: query => query.state?.data?.id === conversation.id,
      }, () => conversation)
    },
  )
}

export function useMessageUpdater () {
  const queryClient = useQueryClient()
  const { isThreadReply } = useMessageHelpers()
  const { on } = useSocketEvents()

  function updateMessageIn (queryKey, message) {
    // Update individual message
    let added = false
    queryClient.setQueryData(
      queryKey,
      (data) => {
        let { pages, pageParams } = data ?? { pages: [], pageParams: [] }
        pages = pages.map(page => ({
          ...page,
          results: page.results.map(result => {
            if (result.id === message.id) {
              added = true
              return message
            }
            return result
          }),
        }))

        if (!added && pages.length > 0) {
          // add it to the first page if the id is higher than the first entry
          // TODO: this doesn't add in the right place for thread conversation... needs to go at the end, although pagination isn't wired up properly yet anyway
          const page = pages[0]
          const firstResult = page.results?.[0]
          if (firstResult && message.id > firstResult.id) {
            pages = [{
              ...page,
              results: [message, ...page.results],
            }, ...pages.slice(1)]
            added = true
          }
        }

        return {
          pages,
          pageParams,
        }
      },
    )
    return added
  }

  on(
    'conversations:message',
    message => {
      // Update individual message query
      queryClient.setQueryData(queryKeyMessageItem(message.id), () => message)

      // Update a thread reply
      if (isThreadReply(message)) {
        updateMessageIn(queryKeyMessageThreadList(message.thread), message)
        return
      }

      // Update normal message, or invalidate
      if (!updateMessageIn(queryKeyMessageList(message.conversation), message)) {
        queryClient.invalidateQueries(queryKeyMessageList(message.conversation))
      }
    },
  )
}

export function useConversationQuery ({ groupId, placeId }) {
  const query = useQuery(
    queryKeyConversation({ groupId, placeId }),
    () => {
      if (placeId.value) {
        return placesAPI.conversation(unref(placeId))
      }
      else if (groupId.value) {
        return groupsAPI.conversation(unref(groupId))
      }
    },
    {
      enabled: computed(() => Boolean(unref(groupId) || unref(placeId))),
    },
  )
  return {
    ...query,
    conversation: query.data,
  }
}

function paginationHelpers (query) {
  const {
    isFetching, // TODO: check we don't need isFetchNextPage
    hasNextPage,
    fetchNextPage,
  } = query

  // A function that can be passed into a QInfiniteScroll @load
  async function infiniteScrollLoad (index, done) {
    if (!isFetching.value && hasNextPage.value) await fetchNextPage()
    done(!hasNextPage.value)
  }

  return {
    infiniteScrollLoad,
  }
}

export function useMessageListQuery ({ conversationId }) {
  const query = useInfiniteQuery(
    queryKeyMessageList(conversationId),
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
    ...paginationHelpers(query),
    messages: flattenPaginatedData(query),
  }
}

export function useMessageItemQuery ({ messageId }) {
  const query = useQuery(
    queryKeyMessageItem(messageId),
    () => messageAPI.get(unref(messageId)),
    {
      enabled: computed(() => Boolean(unref(messageId))),
    },
  )
  return {
    ...query,
    message: query.data,
  }
}

export function useMessageThreadListQuery ({ messageId }) {
  const query = useInfiniteQuery(
    queryKeyMessageThreadList(messageId),
    () => messageAPI.listThread(unref(messageId)),
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: computed(() => Boolean(unref(messageId))),
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
    messages: flattenPaginatedData(query),
  }
}
