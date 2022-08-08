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
  const {
    getIsThreadReply,
    getIsPartOfThread,
  } = useMessageHelpers()
  const { on } = useSocketEvents()

  function updateMessageIn (queryKey, message, reversed = false) {
    // Update individual message
    let added = false
    queryClient.setQueryData(
      queryKey,
      (data) => {
        if (data === undefined) return undefined // Don't update if we don't have data already...
        let { pages, pageParams } = data ?? { pages: [], pageParams: [] }

        // If we already have the message, replace it
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

        // Otherwise add it to the end, if the id is bigger than previous entry
        if (!added && pages.length > 0) {
          if (reversed) {
            const lastPage = pages[pages.length - 1]
            const lastResult = lastPage.results?.[lastPage.results?.length - 1]
            if (lastResult && message.id > lastResult.id) {
              pages = [
                ...pages.slice(0, -1),
                {
                  ...lastPage,
                  results: [...lastPage.results, message],
                },
              ]
              added = true
            }
          }
          else {
            const firstPage = pages[0]
            const firstResult = firstPage.results?.[0]
            if (firstResult && message.id > firstResult.id) {
              pages = [{
                ...firstPage,
                results: [message, ...firstPage.results],
              }, ...pages.slice(1)]
              added = true
            }
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
      queryClient.setQueryData(queryKeyMessageItem(message.id), value => value !== undefined ? message : undefined)

      // Update a message that is part of a thread
      if (getIsPartOfThread(message)) {
        // reverse ordering for this case
        if (!updateMessageIn(queryKeyMessageThreadList(message.thread), message, true)) {
          queryClient.invalidateQueries(queryKeyMessageThreadList(message.thread))
        }
      }

      // Update normal message
      if (!getIsThreadReply(message)) {
        if (!updateMessageIn(queryKeyMessageList(message.conversation), message)) {
          queryClient.invalidateQueries(queryKeyMessageList(message.conversation))
        }
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

  // TODO: can make a next and previous one...
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
      getPreviousPageParam: page => extractCursor(page.previous) || undefined,
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
    ({ pageParam }) => messageAPI.listThread(unref(messageId), pageParam, 20),
    {
      cacheTime: 0,
      staleTime: 0,
      enabled: computed(() => Boolean(unref(messageId))),
      getNextPageParam: page => {
        if (!page) {
          console.log('huh page is', page)
          return undefined
        }
        return extractCursor(page.next) || undefined
      },
      getPreviousPageParam: page => extractCursor(page.previous) || undefined,
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
