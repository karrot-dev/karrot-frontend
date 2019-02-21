<template>
  <div
    v-if="conversation && !isClosed && !conversation.canFetchFuture"
    class="bg-white"
  >
    <ConversationCompose
      :status="conversation.sendStatus"
      :placeholder="messagePrompt"
      :autofocus="!$q.platform.is.mobile"
      :is-participant="conversation.isParticipant"
      slim
      :value="draft"
      @input="saveDraft"
      @submit="sendMessage"
    />
  </div>
</template>

<script>
import ConversationCompose from '@/messages/components/ConversationCompose'

import { mapGetters, mapActions, mapMutations } from 'vuex'

export default {
  components: {
    ConversationCompose,
  },
  computed: {
    ...mapGetters({
      conversation: 'detail/conversation',
    }),
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
    draft () {
      return this.conversation && this.conversation.draft
    },
  },
  methods: {
    ...mapActions({
      send: 'conversations/send',
    }),
    ...mapMutations({
      commitDraft: 'conversations/saveDraft',
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
    saveDraft (content) {
      // TODO handle threads
      this.commitDraft({
        conversationId: this.conversation.id,
        value: content,
      })
    },
  },
}
</script>
