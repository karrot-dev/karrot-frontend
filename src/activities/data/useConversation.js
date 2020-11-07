// holds ONE conversation

import messagesAPI from '@/messages/api/messages'
import conversationsAPI from '@/messages/api/conversations'
import { toPlainObject, useCollection } from '@/activities/data/useCollection'
import { computed, reactive, ref, toRefs, unref, watch } from '@vue/composition-api'
import { createStatus, withStatus } from '@/activities/data/actionStatus'
import { insertSorted } from '@/messages/datastore/conversations'

export function useConversation ({ conversationId }) {
  // TODO: refactor into a useValue or something... a singular one to go with useCollection
  const conversation = ref(null)
  watch(() => toPlainObject({ conversationId }), async (value, oldValue, onInvalidate) => {
    let valid = true
    if (value.conversationId) {
      const result = await conversationsAPI.get(value.conversationId)
      if (valid) {
        console.log('loaded conversation!', result)
        conversation.value = result
      }
    }
    onInvalidate(() => {
      valid = false
      conversation.value = null
    })
  }, { immediate: true })
  // ----------------------------------------------------------------------------------------------------------

  const fetchMoreStatus = reactive(createStatus())
  const cursor = ref(null)

  // TODO: hmmm I need a different state storage here for messages... so we can't use the update mechanism
  // but it actually seems OK as its only really handling status... but also reset... maybe pass it a reset function...
  const { status } = useCollection({ conversationId }, fetcher)

  const messages = ref([])

  function update (newMessages) {
    messages.value = insertSorted(messages.value, newMessages)
  }

  async function fetcher ({ conversationId }, { isValid }) {
    if (conversationId) {
      const { results, next } = await messagesAPI.list(conversationId)
      if (isValid()) {
        cursor.value = next
        update(results)
      }
    }
  }

  function fetchMore () {
    if (!unref(cursor)) return
    console.log('fetching more!!!', unref(cursor))
    if (fetchMoreStatus.state === 'PENDING') {
      console.log('ignoring fetch more as we arere in progress')
      return // should I return a boolean/
    }
    withStatus(fetchMoreStatus, async () => {
      const { results, next } = await messagesAPI.listMore(unref(cursor))
      // TODO: check valid! ... needs to also be if conversationId changes
      cursor.value = next
      update(results)
    })
  }

  const canFetchMore = computed(() => Boolean(unref(cursor)))

  return {
    conversation,
    messages,
    status,
    fetchMore,
    fetchMoreStatus: toRefs(fetchMoreStatus),
    canFetchMore,
  }
}
