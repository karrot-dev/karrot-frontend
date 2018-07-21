<template>
  <div
    class="col bar relative-position"
  >
    <div
      class="absolute-full scroll"
      ref="scroll"
    >
      <div
        v-if="fetchingPast"
        class="full-width text-center generic-padding"
      >
        <q-spinner-dots :size="40" />
      </div>
      <q-infinite-scroll :handler="maybeFetchFuture">
        <q-list
          no-border
          class="bg-white"
        >
          <ConversationMessage
            v-for="message in conversation.messages"
            :key="message.id"
            :message="message"
            slim
            @toggleReaction="$emit('toggleReaction', arguments[0])"
            @save="$emit('saveMessage', arguments[0])"
          />
          <ConversationCompose
            v-if="!this.conversation.canFetchFuture"
            ref="compose"
            :status="conversation.sendStatus"
            slim
            @submit="sendMessage"
            :placeholder="messagePrompt"
            :autofocus="startAtBottom"
          />
        </q-list>
        <div
          slot="message"
          class="full-width text-center generic-padding"
        >
          <q-spinner-dots :size="40" />
        </div>
      </q-infinite-scroll>
      <q-scroll-observable @scroll="onScroll" />
    </div>
    <q-resize-observable @resize="restoreScrollPosition" />
  </div>
</template>

<script>
import ConversationMessage from '@/components/Conversation/ConversationMessage'
import ConversationCompose from '@/components/Conversation/ConversationCompose'
import {
  scroll,
  QSpinnerDots,
  QList,
  QResizeObservable,
  QScrollObservable,
  QInfiniteScroll,
} from 'quasar'
const { getScrollHeight, getScrollPosition, setScrollPosition } = scroll

export default {
  components: {
    ConversationMessage,
    ConversationCompose,
    QSpinnerDots,
    QList,
    QResizeObservable,
    QScrollObservable,
    QInfiniteScroll,
  },
  props: {
    conversation: { type: Object, default: null },
    away: { type: Boolean, required: true },
    currentUser: { type: Object, default: null },
    startAtBottom: { type: Boolean, default: false },
  },
  data () {
    return {
      newestMessageId: -1,
      oldestMessageId: -1,
      scrollPositionFromBottom: 0,
      hideBottomSpinner: null,
    }
  },
  computed: {
    hasLoaded () {
      const s = this.conversation.fetchStatus
      return !s.pending && !s.hasValidationErrors
    },
    messagePrompt () {
      if (this.conversation.thread) {
        return this.$t('CONVERSATION.REPLY_TO_MESSAGE')
      }
      if (this.conversation.messages.length > 0) {
        return this.$t('WALL.WRITE_MESSAGE')
      }
      return this.$t('WALL.WRITE_FIRST_MESSAGE')
    },
    fetchingPast () {
      return this.conversation.fetchPastStatus && this.conversation.fetchPastStatus.pending
    },
    fetchingFuture () {
      return this.conversation.fetchFutureStatus && this.conversation.fetchFutureStatus.pending
    },
  },
  watch: {
    away (away) {
      if (!away) this.markRead(this.newestMessageId)
    },
    hasLoaded: {
      immediate: true,
      handler (hasLoaded) {
        if (hasLoaded && this.startAtBottom) this.scrollToBottom()
      },
    },
    'conversation.id' (id) {
      Object.assign(this, {
        newestMessageId: -1,
        oldestMessageId: -1,
        scrollPositionFromBottom: 0,
      })
    },
    'conversation.messages': {
      immediate: true,
      async handler (messages) {
        await this.$nextTick()
        if (!messages || messages.length === 0) return
        // Jump to bottom when new messages added
        const newNewestMessage = messages[messages.length - 1]

        if (this.newestMessageId !== newNewestMessage.id) {
          const scrollPosition = this.getScrollPositionFromBottom()
          this.newestMessageId = newNewestMessage.id
          if (scrollPosition < 100) {
            this.scrollToBottom()
            if (!this.away) this.markRead(this.newestMessageId)
          }
        }
        // Retain position when old message added
        const newOldestMessageId = messages[0].id
        if (this.startAtBottom && this.oldestMessageId !== newOldestMessageId) {
          this.saveScrollPosition()
          this.oldestMessageId = newOldestMessageId
          this.$nextTick(() => {
            this.restoreScrollPosition()
          })
        }
      },
    },
    fetchingFuture (pending) {
      if (pending === false && this.hideBottomSpinner) {
        this.hideBottomSpinner()
        this.hideBottomSpinner = null
      }
    },
  },
  methods: {
    markRead (messageId) {
      const isThreadReply = this.conversation.thread && this.messageId !== this.conversation.thread
      if (!isThreadReply && this.conversation.unreadMessageCount > 0) {
        this.$emit('mark', {
          id: this.conversation.id,
          seenUpTo: messageId,
        })
      }
      if (isThreadReply && this.conversation.threadMeta && this.conversation.threadMeta.unreadReplyCount > 0) {
        this.$emit('mark', {
          threadId: this.conversation.thread,
          seenUpTo: messageId,
        })
      }
    },
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
      this.$emit('send', data)
    },
    getScrollPositionFromBottom () {
      if (!this.$refs.scroll) return
      const { height } = this.$refs.scroll.getBoundingClientRect()
      const scrollHeight = getScrollHeight(this.$refs.scroll)
      const scrollPosition = getScrollPosition(this.$refs.scroll)
      return scrollHeight - scrollPosition - height
    },
    saveScrollPosition () {
      const newScrollPositionFromBottom = this.getScrollPositionFromBottom()
      if (this.scrollPositionFromBottom !== newScrollPositionFromBottom) {
        this.scrollPositionFromBottom = newScrollPositionFromBottom
      }
    },
    restoreScrollPosition () {
      if (!this.$refs.scroll || !this.startAtBottom) return
      const { height } = this.$refs.scroll.getBoundingClientRect()
      const scrollHeight = getScrollHeight(this.$refs.scroll)
      const scrollPosition = scrollHeight - height - this.scrollPositionFromBottom
      setScrollPosition(this.$refs.scroll, scrollPosition)
    },
    scrollToBottom () {
      this.$nextTick(() => {
        if (this.$refs.scroll) {
          setScrollPosition(this.$refs.scroll, getScrollHeight(this.$refs.scroll))
        }
      })
    },
    async maybeFetchFuture (index, done) {
      if (!this.conversation.canFetchFuture) {
        await this.$nextTick()
        done()
        return
      }
      this.$emit('fetchFuture')
      this.hideBottomSpinner = done
    },
    onScroll ({ position }) {
      if (position < 50 && !this.fetchingPast && this.conversation.canFetchPast) {
        this.$emit('fetchPast', this.conversation.id)
      }
    },
  },
}
</script>
