// holds ONE conversation

import messagesAPI from '@/messages/api/messages'
import conversationsAPI from '@/messages/api/conversations'
import groupsAPI from '@/group/api/groups'
import { ref, unref, computed } from '@vue/composition-api'
import { insertSorted } from '@/messages/datastore/conversations'
import { useFetcher } from '@/activities/data/useFetcher'
import { useCursorPagination } from '@/activities/data/useCursorPagination'
import { useEvents } from '@/activities/data/useEvents'
// eslint-disable-next-line no-unused-vars
import { onCacheUnmounted, permitCachedUsage } from '@/activities/data/useCached'

// you can pass _one_ of
export function useConversation (params) {
  permitCachedUsage()
  if (Object.keys(params).length !== 1) throw new Error('Please pass in exactly one param for finding conversation')

  const conversationRef = ref(null)
  const messagesRef = ref([])

  const conversationId = computed(() => {
    // Either use the param we passed in...
    if (params.conversationId) return unref(params.conversationId)
    // Or the id from the actual fetched conversation
    const conversation = unref(conversationRef)
    return conversation && conversation.id
  })

  function fetchConversation ({ groupId, conversationId }) {
    if (groupId) return groupsAPI.conversation(groupId)
    if (conversationId) return conversationsAPI.get(conversationId)
    throw new Error('No params for getting conversation!')
  }

  const { status: conversationStatus } = useFetcher(params, {
    async fetcher ({ conversationId, groupId }, { isValid }) {
      if (groupId || conversationId) {
        const result = await fetchConversation({ groupId, conversationId })
        if (isValid()) {
          conversationRef.value = result
        }
      }
    },
    onInvalidate () {
      conversationRef.value = null
    },
  })

  // nice idea but not so simple as we don't have the right pagination ref to then continue...
  // arguably we can't either... maybe better without cursor pagination, but timestamp based pagination?
  // onCacheUnmounted(() => {
  //   invalidatePagination()
  //   messagesRef.value.length = 10
  // })

  const { status } = useFetcher({ conversationId }, {
    async fetcher ({ conversationId }, { isValid }) {
      if (conversationId) {
        const { results, next } = await messagesAPI.list(conversationId)
        if (isValid()) {
          setCursor(next)
          updateMessages(results)
        }
      }
    },
    onInvalidate () {
      messagesRef.value = []
      invalidatePagination()
    },
  })

  const {
    moreStatus,
    fetchMore,
    canFetchMore,
    setCursor,
    invalidatePagination,
  } = useCursorPagination({
    async fetcher (cursor, { isValid }) {
      const { results, next } = await messagesAPI.listMore(cursor)
      if (isValid()) {
        setCursor(next)
        updateMessages(results)
      }
    },
  })

  function updateMessages (newMessages) {
    messagesRef.value = insertSorted(messagesRef.value, newMessages)
  }

  const { on } = useEvents()

  on('conversations:conversation', updatedConversation => {
    const conversation = unref(conversationRef)
    if (conversation.id === updatedConversation.id) {
      conversationRef.value = updatedConversation
    }
  })

  on('conversations:message', message => {
    const conversation = unref(conversationRef)
    if (message.conversation === conversation.id && (!message.thread || message.thread === message.id)) {
      // Only main thread messages... I guess we'd have a useThread for the threads...?
      updateMessages([message])
    }
  })

  return {
    conversation: conversationRef,
    conversationStatus,
    messages: messagesRef,
    status,
    fetchMore,
    fetchMoreStatus: moreStatus,
    canFetchMore,
  }
}
