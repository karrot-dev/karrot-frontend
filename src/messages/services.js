import { ref, unref, computed, watch } from 'vue'

import { defineService } from '@/utils/datastore/helpers'
import {
  useConversationQuery,
  useMessageItemQuery,
  useMessageListQuery,
  useMessageThreadListQuery,
} from '@/messages/queries'
import { useActivityItemQuery } from '@/activities/queries'
import { useUserService } from '@/users/services'

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
  const {
    activity,
  } = useActivityItemQuery(
    { activityId },
    // The keepPreviousData options prevents the detail header from flashing between changes
    { keepPreviousData: true },
  )

  return {
    ...useConversationAndMessages({ activityId }),
    activity,
  }
}

function useConversationAndMessages (conversationQueryParams) {
  const {
    conversation,
    isLoading: isLoadingConversation,
  } = useConversationQuery(
    conversationQueryParams,
    // The keepPreviousData options prevents the detail header from flashing between changes
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
  }
}

function useUserChatDetail (userId) {
  const { getUserById } = useUserService()
  return {
    ...useConversationAndMessages({ userId }),
    user: computed(() => getUserById(unref(userId))),
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
  }
}

export const useDetailService = defineService(() => {
  const type = ref(null) // thread, application, etc.
  const id = ref(null) // the item id

  const isDetailActive = computed(() => Boolean(type.value && id.value)) // vuex one did it based on conversation (pending or loaded)

  const activeState = ref(createDefaultState())

  // For thread
  const threadMessageId = computed(() => type.value === 'thread' ? id.value : null)
  const threadState = useThreadDetail(threadMessageId)

  // For activity
  const activityId = computed(() => type.value === 'activity' ? id.value : null)
  const activityState = useActivityDetail(activityId)

  // For user chat
  const userId = computed(() => type.value === 'user' ? id.value : null)
  const userChatState = useUserChatDetail(userId)

  // Each type of detail view can declare state values, and we'll switch them depending on which is active
  const statesByType = {
    thread: threadState,
    activity: activityState,
    user: userChatState,
  }

  // We collect all keys used by all state objects and create
  // computed refs that will read their value from the active state
  const keys = Object.keys(Object.values(statesByType).reduce((acc, obj) => Object.assign(acc, obj), {}))
  const refs = {}
  for (const key of keys) {
    refs[key] = computed(() => activeState.value[key])
  }

  // Select state depending on which type is active
  watch(type, value => {
    const state = statesByType[value]
    if (state) {
      activeState.value = state
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

  function openUserChat (userId) {
    id.value = userId
    type.value = 'user'
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
    openUserChat,

    close,
  }
})
