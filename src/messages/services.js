import { ref, computed, watch } from 'vue'

import { defineService } from '@/utils/datastore/helpers'
import {
  useConversationQuery,
  useMessageItemQuery,
  useMessageListQuery,
  useMessageThreadListQuery,
} from '@/messages/queries'
import { useActivityItemQuery } from '@/activities/queries'

function useThreadDetail (messageId) {
  // TODO: could first look in query client to see if we have the message already...
  const {
    message: firstMessage,
    isLoading: isLoadingConversation,
  } = useMessageItemQuery(
    { messageId },
    { keepPreviousData: true },
  )

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

  const messages = computed(() => {
    // If there is not already a thread, then our thread will have no messages in it... so we insert the first message inside
    if (firstMessage.value && threadMessages.value?.length === 0) {
      return [{
        ...firstMessage.value,
        // create a fake thread/threadMeta value so it'll display properly
        thread: firstMessage.value.id,
        threadMeta: {
          seenUpTo: firstMessage.value.id,
          participants: [firstMessage.value.author],
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

function useActivityDetail (activityId) {
  // The keepPreviousData options prevents the detail header from flashing between changes
  const {
    activity,
  } = useActivityItemQuery(
    { activityId },
    { keepPreviousData: true },
  )

  const {
    conversation,
    isLoading: isLoadingConversation,
  } = useConversationQuery(
    { activityId },
    { keepPreviousData: true },
  )

  const conversationId = computed(() => conversation.value?.id)

  const {
    messages,
    isLoading: isLoadingMessages,
    hasNextPage,
    hasPreviousPage,
    isFetchingNextPage,
    isFetchingPreviousPage,
    fetchNextPage,
    fetchPreviousPage,
  } = useMessageListQuery({ conversationId })

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

    activity,
  }
}

function createDefaultState () {
  return {
    // For all detail views
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

    // Extra stuff for particular types
    // type=activity
    activity: null,
  }
}

export const useDetailService = defineService(() => {
  const type = ref(null) // thread, application, etc.
  const id = ref(null) // the item id

  const isDetailActive = computed(() => Boolean(type.value && id.value)) // vuex one did it based on conversation (pending or loaded)

  // Each type of detail view can declare these state values, and we'll switch them depending on which is active
  const initialState = createDefaultState()
  const activeState = ref(initialState)

  // We create a bunch of computed refs, all keys we ever use must be in the initial state
  // We then always read from the active state object
  const refs = {}
  for (const key of Object.keys(initialState)) {
    refs[key] = computed(() => activeState.value[key])
  }

  // For thread
  const threadMessageId = computed(() => type.value === 'thread' ? id.value : null)
  const threadState = useThreadDetail(threadMessageId)

  // For activity
  const activityId = computed(() => type.value === 'activity' ? id.value : null)
  const activityState = useActivityDetail(activityId)

  // Assign to state depending on which type is active
  watch(type, value => {
    if (value === 'thread') {
      activeState.value = threadState
    }
    else if (value === 'activity') {
      activeState.value = activityState
    }
    else {
      activeState.value = createDefaultState()
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

  function openActivity (activityId) {
    id.value = activityId
    type.value = 'activity'
    // TODO: mobile redirect to other page?
  }

  function close () {
    type.value = null
    id.value = null
  }

  return {
    ...refs,
    isDetailActive,

    openThread,
    openActivity,
    close,
  }
})
