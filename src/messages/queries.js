import { useInfiniteQuery, useQuery, useQueryClient } from '@tanstack/vue-query'
import { unref, computed } from 'vue'

import activitiesAPI from '@/activities/api/activities'
import applicationsAPI from '@/applications/api/applications'
import groupsAPI from '@/group/api/groups'
import issuesAPI from '@/issues/api/issues'
import conversationsAPI from '@/messages/api/conversations'
import messageAPI from '@/messages/api/messages'
import { useMessageHelpers } from '@/messages/helpers'
import offersAPI from '@/offers/api/offers'
import placesAPI from '@/places/api/places'
import usersAPI from '@/users/api/users'
import { useSocketEvents } from '@/utils/composables'
import { indexById, indexBy } from '@/utils/datastore/helpers'
import { extractCursor, flattenPaginatedData, useQueryHelpers, useWait } from '@/utils/queryHelpers'

export const QUERY_KEY_BASE = 'messages'
export const queryKeyConversationList = () => [QUERY_KEY_BASE, 'conversations', 'list']
export const queryKeyMyThreadList = () => [QUERY_KEY_BASE, 'myThreads', 'list']
export const queryKeyConversation = params => [QUERY_KEY_BASE, 'conversation', params].filter(Boolean)
export const queryKeyMessageList = conversationId => [QUERY_KEY_BASE, 'list', conversationId].filter(Boolean)
export const queryKeyMessageThreadList = messageId => [QUERY_KEY_BASE, 'thread', 'list', messageId].filter(Boolean)
export const queryKeyMessageItem = messageId => [QUERY_KEY_BASE, 'message', messageId].filter(Boolean)

export function useConversationUpdater () {
  const queryClient = useQueryClient()
  const { on } = useSocketEvents()
  on(
    'conversations:conversation',
    conversation => {
      // The conversations are not stored by conversation id, so we have to look through the data to find matching ones
      queryClient.setQueriesData({
        queryKey: queryKeyConversation(),
        predicate: query => query.state?.data?.id === conversation.id,
      }, () => conversation)
      queryClient.invalidateQueries(queryKeyConversationList())
    },
  )
}

export function useMessageUpdater () {
  const queryClient = useQueryClient()
  const { maybeUpdateDataWith } = useQueryHelpers()
  const {
    getIsThreadReply,
    getIsPartOfThread,
  } = useMessageHelpers()
  const { on } = useSocketEvents()

  // TODO: maybe can use maybeUpdateDataWith to have less duplicated code? it's not exactly the same though...
  function updateMessageIn (queryKey, message) {
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

        // Otherwise add it to start/end depending on the order
        if (!added && pages.length > 0) {
          if (getIsOldestFirst()) {
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

    function getIsOldestFirst () {
      // We rely on the meta: { order: <val> } to have been set on the query to know if we're going to
      // insert the message at the top or the bottom
      // Set it to 'newest-first' or 'oldest-first'
      const query = queryClient.getQueryCache().find(queryKey)
      const order = query?.meta?.order
      if (!order) throw new Error(`You must set order on the query meta, missing for queryKey: ${queryKey}`)
      return order === 'oldest-first'
    }

    return added
  }

  on(
    'conversations:message',
    message => {
      // Update individual message query
      queryClient.setQueryData(
        queryKeyMessageItem(message.id),
        maybeUpdateDataWith(message),
      )

      // Update a message that is part of a thread
      if (getIsPartOfThread(message)) {
        if (!updateMessageIn(queryKeyMessageThreadList(message.thread), message)) {
          queryClient.invalidateQueries(queryKeyMessageThreadList(message.thread))
        }
        queryClient.invalidateQueries(queryKeyMyThreadList())
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

export function useConversationListQuery () {
  const query = useInfiniteQuery(
    queryKeyConversationList(),
    ({ pageParam: cursor }) => conversationsAPI.list(
      { cursor, exclude_read: false },
    ),
    {
      cacheTime: 1000,
      staleTime: 0,
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => {
          const { conversations, messages, activities, applications, issues, offers } = page.results
          const messagesByConversationId = indexBy(messages, 'conversation')
          const activitiesById = indexById(activities)
          const issuesById = indexById(issues)
          const offersById = indexById(offers)
          const applicationsById = indexById(applications)

          function getTarget (conversation) {
            const { targetId } = conversation
            switch (conversation.type) {
              case 'activity': return activitiesById[targetId]
              case 'issue': return issuesById[targetId]
              case 'offer': return offersById[targetId]
              case 'application': return applicationsById[targetId]
            }
            return null
          }
          return conversations.map(conversation => {
            return {
              ...conversation,
              latestMessage: messagesByConversationId[conversation.id],
              target: getTarget(conversation),
            }
          })
        }),
        pageParams,
      }),
    },
  )
  return {
    ...query,
    conversations: flattenPaginatedData(query),
  }
}

export function useMyThreadListQuery () {
  const query = useInfiniteQuery(
    queryKeyMyThreadList(),
    ({ pageParam: cursor }) => messageAPI.listMyThreads(
      { cursor, exclude_read: false },
    ),
    {
      cacheTime: 1000,
      staleTime: 0,
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => {
          const { threads, messages } = page.results
          const messagesByThreadId = indexBy(messages, 'thread')

          return threads.map(thread => {
            return {
              ...thread,
              latestMessage: messagesByThreadId[thread.id],
            }
          })
        }),
        pageParams,
      }),
    },
  )
  return {
    ...query,
    threads: flattenPaginatedData(query),
  }
}

// Only pass in ONE of these params :)
export function useConversationQuery ({
  groupId,
  placeId,
  activityId,
  userId,
  applicationId,
  offerId,
  issueId,
}, queryOptions = {}) {
  const query = useQuery(
    queryKeyConversation({
      groupId,
      placeId,
      activityId,
      userId,
      applicationId,
      offerId,
      issueId,
    }),
    () => {
      if (unref(userId)) {
        return usersAPI.conversation(unref(userId))
      }
      else if (unref(activityId)) {
        return activitiesAPI.conversation(unref(activityId))
      }
      else if (unref(placeId)) {
        return placesAPI.conversation(unref(placeId))
      }
      else if (unref(groupId)) {
        return groupsAPI.conversation(unref(groupId))
      }
      else if (unref(applicationId)) {
        return applicationsAPI.conversation(unref(applicationId))
      }
      else if (unref(offerId)) {
        return offersAPI.conversation(unref(offerId))
      }
      else if (unref(issueId)) {
        return issuesAPI.conversation(unref(issueId))
      }
    },
    {
      enabled: computed(() => [groupId, placeId, activityId, userId, applicationId, offerId, issueId].some(unref)),
      ...queryOptions,
    },
  )
  return {
    ...query,
    conversation: query.data,
  }
}

export function infiniteScroll (query) {
  const {
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = query

  // A function that can be passed into a QInfiniteScroll @load
  // TODO: use this more!
  async function infiniteScrollLoad (index, done) {
    if (!isFetchingNextPage.value && hasNextPage.value) await fetchNextPage()
    done(!hasNextPage.value)
  }

  // For --> <QInfiniteScroll v-bind="infiniteScroll" />
  return computed(() => {
    return {
      onLoad: infiniteScrollLoad,
      disable: !hasNextPage.value,
    }
  })
}

export function useMessageListQuery ({ conversationId }, { order, pageSize = 20 } = {}) {
  if (!order) throw new Error('order is required')
  const query = useInfiniteQuery(
    // we don't put the order in here, so make sure to use consistent ordering for a given conversationId
    // could check the meta for existing data?
    queryKeyMessageList(conversationId),
    ({ pageParam: cursor }) => messageAPI.list(
      unref(conversationId),
      { cursor, pageSize, order },
    ),
    {
      meta: {
        order,
      },
      // load on demand... TODO: consider a bit more...
      cacheTime: 1000,
      staleTime: 0,
      enabled: computed(() => Boolean(unref(conversationId))),
      getNextPageParam: page => extractCursor(page.next) || undefined,
      select: ({ pages, pageParams }) => ({
        pages: pages.map(page => page.results),
        pageParams,
      }),
      refetchOnWindowFocus: false, // causes a storm with a lot of pages loaded TODO: think about it more...
    },
  )
  return {
    ...query,
    infiniteScroll: infiniteScroll(query),
    messages: flattenPaginatedData(query),
  }
}

export function useMessageItemQuery ({ messageId }, queryOptions = {}) {
  const query = useQuery(
    queryKeyMessageItem(messageId),
    () => messageAPI.get(unref(messageId)),
    {
      enabled: computed(() => Boolean(unref(messageId))),
      ...queryOptions,
    },
  )
  return {
    ...query,
    wait: useWait(query),
    message: query.data,
  }
}

export function useMessageThreadListQuery ({ messageId }, { order, pageSize } = {}) {
  if (!order) throw new Error('order is required')
  const query = useInfiniteQuery(
    queryKeyMessageThreadList(messageId),
    ({ pageParam: cursor }) => messageAPI.listThread(unref(messageId), { cursor, pageSize, order }),
    {
      meta: {
        order,
      },
      cacheTime: 1000,
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
    infiniteScroll: infiniteScroll(query),
    messages: flattenPaginatedData(query),
  }
}
