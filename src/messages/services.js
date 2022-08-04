import { ref, computed, reactive, watch, toRefs } from 'vue'

import { defineService } from '@/utils/datastore/helpers'
import { useMessageItemQuery, useMessageThreadListQuery } from '@/messages/queries'

function useThread (messageId) {
  const {
    message: firstMessage,
    isLoading: isLoadingConversation,
  } = useMessageItemQuery({ messageId })
  const {
    messages: threadMessages,
    isLoading: isLoadingMessages,
  } = useMessageThreadListQuery({ messageId })

  const messages = computed(() => {
    // If there is not already a thread, then our thread will have no messages in it... so we insert the first message inside
    if (firstMessage.value && threadMessages.value.length === 0) {
      return [{
        ...firstMessage.value,
        // initialize to make ConversationCompose detect a thread
        thread: firstMessage.value.id,
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
  }
}

export const useDetailService = defineService(() => {
  const type = ref(null) // thread, application, etc.
  const id = ref(null) // the item id

  const isDetailActive = computed(() => Boolean(type.value && id.value)) // vuex one did it based on conversation (pending or loaded)

  // For thread
  const messageId = computed(() => type.value === 'thread' && id.value)

  const threadRefs = useThread(messageId)
  const stuff = reactive({
    conversation: null,
    messages: [],
    isLoadingConversation: false,
    isLoadingMessages: false,
  })

  watch(type, value => {
    switch (value) {
      case 'thread': Object.assign(stuff, threadRefs)
    }
  })

  function openThread (messageId) {
    id.value = messageId
    type.value = 'thread'

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

  return {
    ...toRefs(stuff),
    isDetailActive,
    openThread,
  }
})
