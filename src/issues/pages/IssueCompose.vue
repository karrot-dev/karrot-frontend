<template>
  <div
    v-if="conversation && !isClosed"
    class="bg-white"
  >
    <ConversationCompose
      :status="sendStatus"
      :placeholder="messagePrompt"
      :is-participant="isParticipant"
      :draft-key="conversation.id"
      slim
      filled
      square
      @submit="sendMessage"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

import { useActiveIssueService } from '@/issues/services'
import { useConversationHelpers } from '@/messages/helpers'
import { useSendMessageMutation } from '@/messages/mutations'

import ConversationCompose from '@/messages/components/ConversationCompose'

const { t } = useI18n()

const {
  mutate: send,
  status: sendStatus,
} = useSendMessageMutation()

const {
  conversation,
  messages,
} = useActiveIssueService()

const {
  getIsParticipant,
} = useConversationHelpers()

const messagePrompt = computed(() => {
  if (!conversation.value) return
  if (conversation.value.thread) {
    return t('CONVERSATION.REPLY_TO_MESSAGE')
  }
  if (messages.value.length > 0) {
    return t('WALL.WRITE_MESSAGE')
  }
  return t('WALL.WRITE_FIRST_MESSAGE')
})

const isClosed = computed(() => {
  return conversation.value?.isClosed
})

const isParticipant = computed(() => Boolean(conversation.value && getIsParticipant(conversation.value)))

function sendMessage ({ content, images }) {
  send({
    id: conversation.value.id,
    content,
    images,
  })
}

</script>
