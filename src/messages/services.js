import { ref, unref, computed, watch } from 'vue'

import conversationsAPI from '@/messages/api/conversations'
import messagesAPI from '@/messages/api/messages'

import { defineService } from '@/utils/datastore/helpers'
import {
  useConversationQuery,
  useMessageItemQuery,
  useMessageListQuery,
  useMessageThreadListQuery,
} from '@/messages/queries'
import { useActivityItemQuery } from '@/activities/queries'
import { useUserService } from '@/users/services'
import { useApplicationItemQuery } from '@/applications/queries'
import { useRoute, useRouter } from 'vue-router'
import { useAuthService } from '@/authuser/services'
import { Platform } from 'quasar'
import { useCurrentGroupService } from '@/group/services'

export function useThreadDetail (messageId) {
  const order = 'oldest-first'

  // TODO: could first look in query client to see if we have the message already...
  const {
    message: firstMessage,
    isLoading: isLoadingConversation,
    wait: waitForConversation,
  } = useMessageItemQuery(
    { messageId },
    { keepPreviousData: true },
  )

  const {
    messages: threadMessages,
    isLoading: isLoadingMessages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  } = useMessageThreadListQuery(
    { messageId },
    { order, pageSize: 10 },
  )

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
    order,
    conversation,
    waitForConversation,
    messages,
    isLoadingConversation,
    isLoadingMessages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
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
    ...useConversationAndMessages({ activityId }, { order: 'newest-first' }),
    activity,
  }
}

export function useConversationAndMessages (conversationQueryParams, { order } = {}) {
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
    isFetchingNextPage,
    fetchNextPage,
  } = useMessageListQuery(
    { conversationId },
    { order, pageSize: 10 },
  )

  return {
    order,
    conversation,
    messages,
    isLoadingConversation,
    isLoadingMessages,
    hasNextPage,
    isFetchingNextPage,
    fetchNextPage,
  }
}

function useUserChatDetail (userId) {
  const { getUserById } = useUserService()
  return {
    ...useConversationAndMessages({ userId }, { order: 'newest-first' }),
    user: computed(() => getUserById(unref(userId))),
  }
}

function useApplicationDetail (applicationId) {
  const {
    application,
  } = useApplicationItemQuery(
    { applicationId },
    // The keepPreviousData options prevents the detail header from flashing between changes
    { keepPreviousData: true },
  )

  return {
    ...useConversationAndMessages({ applicationId }, { order: 'newest-first' }),
    application,
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
    isFetchingNextPage: false,
    fetchNextPage: () => {},
  }
}

export const useDetailService = defineService(() => {
  const route = useRoute()
  const router = useRouter()

  const { groupId: currentGroupId } = useCurrentGroupService()

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

  // For application chat
  const applicationId = computed(() => type.value === 'application' ? id.value : null)
  const applicationState = useApplicationDetail(applicationId)

  // Each type of detail view can declare state values, and we'll switch them depending on which is active
  const statesByType = {
    thread: threadState,
    activity: activityState,
    user: userChatState,
    application: applicationState,
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

  /**
   * Here we handle special cases for detail routing
   */
  function installRouterPlugin () {
    router.beforeEach(async (to, from, nextFn) => {
      let next
      if (to.name === 'messageReplies') {
        const messageId = parseInt(to.params.messageId, 10)

        id.value = messageId
        type.value = 'thread'

        // messageReplies is a mobile-only route
        // for desktop we want to:
        // a) open the sidebar with the thread
        // b) redirect to the wall that the thread is part of
        // TODO: make it not do these extra requests...
        if (Platform.is.desktop) {
          const { groupId } = to.params
          const threadMessage = await messagesAPI.get(messageId)
          const conversation = await conversationsAPI.get(threadMessage.conversation)
          if (conversation.type === 'group') {
            next = { name: 'group', params: { groupId: conversation.targetId } }
          }
          else if (conversation.type === 'place') {
            next = { name: 'placeWall', params: { groupId, placeId: conversation.targetId } }
          }
          else {
            next = { name: 'group', params: { groupId } }
          }
        }
      }
      else if (to.name === 'activityDetail') {
        id.value = parseInt(to.params.activityId, 10)
        type.value = 'activity'

        if (Platform.is.desktop) {
          const { groupId, placeId } = to.params
          // On desktop we don't have an activity detail page,
          // we go to the place page, and have a sidebar open
          next = { name: 'place', params: { groupId, placeId } }
        }
      }
      else if (to.name === 'userDetail') {
        id.value = parseInt(to.params.userId, 10)
        type.value = 'user'

        if (Platform.is.desktop) {
          // On desktop we don't have user detail page
          // we can go to profile page with a sidebar
          const { userId } = to.params
          next = { name: 'user', params: { userId } }
        }
      }

      if (next) {
        nextFn(next)
        return
      }

      nextFn()
    })
  }

  // Detail view can come from either Detail page, or separate route components that are details
  // If we open a detail view via a route, we should "close" this one, in preference to the route one
  // TODO: maybe make all detail pages separate components, so they are not all mixed up together here...
  const hasDetailComponent = computed(() => route.matched.some(({ meta }) => meta && meta.isDetail === true))
  watch(hasDetailComponent, hasDetailComponent => {
    if (hasDetailComponent) {
      close()
    }
  })

  // When logged out, close the detail view
  const { isLoggedIn } = useAuthService()
  watch(isLoggedIn, value => {
    if (!value) {
      close()
    }
  })

  function openThread (message) {
    if (Platform.is.mobile) {
      const groupId = route.params.groupId || currentGroupId.value
      router.push({ name: 'messageReplies', params: { groupId, messageId: message.id } })
    }
    id.value = message.id
    type.value = 'thread'
  }

  function openActivity (activity) {
    if (Platform.is.mobile) {
      const groupId = route.params.groupId || currentGroupId.value
      router.push({ name: 'activityDetail', params: { groupId, placeId: activity.place, activityId: activity.id } })
    }
    id.value = activity.id
    type.value = 'activity'
  }

  function openUserChat (user) {
    if (Platform.is.mobile) {
      router.push({ name: 'userDetail', params: { userId: user.id } })
    }
    id.value = user.id
    type.value = 'user'
  }

  function openApplication (application) {
    id.value = application.id
    type.value = 'application'
  }

  function close () {
    type.value = null
    id.value = null
  }

  return {
    ...refs,
    isDetailActive,
    installRouterPlugin,

    openThread,
    openActivity,
    openUserChat,
    openApplication,

    close,
  }
})
