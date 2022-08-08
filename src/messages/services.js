import { ref, computed, reactive, watch, toRefs } from 'vue'

import { defineService } from '@/utils/datastore/helpers'
import { useMessageItemQuery, useMessageThreadListQuery } from '@/messages/queries'
import { useAuthService } from '@/authuser/services'

function useThread (messageId) {
  const {
    message: firstMessage,
    isLoading: isLoadingConversation,
  } = useMessageItemQuery({ messageId })
  const {
    messages: threadMessages,
    isLoading: isLoadingMessages,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useMessageThreadListQuery({ messageId })

  const { userId } = useAuthService()

  const messages = computed(() => {
    // If there is not already a thread, then our thread will have no messages in it... so we insert the first message inside
    if (firstMessage.value && threadMessages.value.length === 0) {
      return [{
        ...firstMessage.value,
        // create a fake thread/threadMeta value so it'll display properly
        thread: firstMessage.value.id,
        threadMeta: {
          seenUpTo: firstMessage.value.id,
          participants: [userId.value],
          isParticipant: true,
          muted: null,
        },
      }]
    }
    return threadMessages.value
  })

  // For a thread, the "conversation" is actually just the first message for some reason...
  const conversation = computed(() => messages.value[0])

  return {
    conversation,
    messages,
    isLoadingConversation,
    isLoadingMessages,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  }
}

function createDefaultState () {
  return {
    conversation: null,
    messages: [],
    isLoadingConversation: false,
    isLoadingMessages: false,
    hasNextPage: false,
    hasPreviousPage: false,
    isFetchingNextPage: false,
    isFetchingPreviousPage: false,
    fetchNextPage: () => {},
    fetchPreviousPage: () => {},
  }
}

export const useDetailService = defineService(() => {
  const type = ref(null) // thread, application, etc.
  const id = ref(null) // the item id

  const isDetailActive = computed(() => Boolean(type.value && id.value)) // vuex one did it based on conversation (pending or loaded)

  // Each type of detail view can declare these state values, and we'll switch them depending on which is active
  const state = reactive(createDefaultState())

  // For thread
  const threadMessageId = computed(() => type.value === 'thread' && id.value)
  const threadRefs = useThread(threadMessageId)

  // Assign to state depending on which type is active
  watch(type, value => {
    switch (value) {
      case 'thread': return Object.assign(state, threadRefs)
      default: Object.assign(state, createDefaultState())
    }
  })

  function openThread (messageId) {
    id.value = messageId
    type.value = 'thread'

    // TODO: implement this logic
    /*
    if (Platform.is.mobile) {
        const { id, groupId } = message
        router.push({ name: 'messageReplies', params: { groupId, messageId: id } }).catch(() => {})
      }
      else {
        dispatch('selectThread', message.id)
      }
     */
  }

  function close () {
    type.value = null
    id.value = null
  }

  return {
    ...toRefs(state),
    isDetailActive,

    openThread,
    close,
  }
})
