<template>
  <div
    v-if="conversation && !isClosed && !conversation.canFetchFuture"
    class="bg-white"
  >
    <ConversationCompose
      :status="conversation.sendStatus"
      :placeholder="messagePrompt"
      :is-participant="conversation.isParticipant"
      slim
      @submit="sendMessage"
    />
  </div>
</template>

<script>
import ConversationCompose from '@/messages/components/ConversationCompose'

import { mapActions } from 'vuex'

export default {
  components: {
    ConversationCompose,
  },
  props: {
    conversation: {
      type: Object,
      default: null,
    },
  },
  computed: {
    messagePrompt () {
      if (!this.conversation) return
      if (this.conversation.thread) {
        return this.$t('CONVERSATION.REPLY_TO_MESSAGE')
      }
      if (this.conversation.messages.length > 0) {
        return this.$t('WALL.WRITE_MESSAGE')
      }
      return this.$t('WALL.WRITE_FIRST_MESSAGE')
    },
    isClosed () {
      return this.conversation && this.conversation.isClosed
    },
  },
  methods: {
    ...mapActions({
      send: 'conversations/send',
    }),
    sendMessage (content) {
      const data = this.conversation.thread
        ? {
          id: this.conversation.conversation,
          threadId: this.conversation.id,
          content,
        }
        : {
          id: this.conversation.id,
          content,
        }
      this.send(data)
    },
  },

}
</script>
