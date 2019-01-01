<template>
  <div
    :class="inline && 'absolute-full scroll'"
    ref="scroll"
  >
    <slot name="beforeChatMessages"/>
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
          :autofocus="!$q.platform.is.mobile && startAtBottom"
        />
      </q-list>
      <div
        slot="message"
        class="full-width text-center generic-padding"
      >
        <q-spinner-dots :size="40" />
      </div>
    </q-infinite-scroll>
    <slot name="afterChatMessages"/>
    <q-scroll-observable @scroll="onScroll" />
  </div>
</template>

<script>
import ConversationMessage from '@/messages/components/ConversationMessage'
import ConversationCompose from '@/messages/components/ConversationCompose'
import {
  scroll,
  dom,
  QSpinnerDots,
  QList,
  QScrollObservable,
  QInfiniteScroll,
} from 'quasar'
const { getScrollHeight, getScrollPosition, setScrollPosition, getScrollTarget } = scroll
const { height } = dom

function getElementHeight (el) {
  if (el === window) return height(window)
  return el.getBoundingClientRect().height
}

export default {
  components: {
    ConversationMessage,
    ConversationCompose,
    QSpinnerDots,
    QList,
    QScrollObservable,
    QInfiniteScroll,
  },
  props: {
    conversation: { type: Object, default: null },
    away: { type: Boolean, required: true },
    currentUser: { type: Object, default: null },
    startAtBottom: { type: Boolean, default: false },
    inline: {
      // if true, create a new overflowed scroll container
      type: Boolean,
      default: false,
    },
  },
  data () {
    return {
      scrollContainer: null,
      newestMessageId: -1,
      oldestMessageId: -1,
      scrollPositionFromBottom: 0,
      hideBottomSpinner: null,
    }
  },
  mounted () {
    this.$nextTick(() => {
      this.scrollContainer = this.inline ? this.$refs.scroll : getScrollTarget(this.$el)
    })
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
      if (!away && !this.conversation.canFetchFuture) {
        this.markRead(this.newestMessageId)
      }
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
    'conversation.messages' (messages) {
      if (!messages || messages.length === 0) return
      // Jump to bottom when new messages added
      const newNewestMessage = messages[messages.length - 1]

      if (this.newestMessageId !== newNewestMessage.id) {
        const scrollPosition = this.getScrollPositionFromBottom()
        this.newestMessageId = newNewestMessage.id
        if (scrollPosition < 100 && !this.away && !this.conversation.canFetchFuture) {
          this.scrollToBottom()
          this.markRead(this.newestMessageId)
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
      if (!this.scrollContainer) return
      const height = getElementHeight(this.scrollContainer)
      const scrollHeight = getScrollHeight(this.scrollContainer)
      const scrollPosition = getScrollPosition(this.scrollContainer)
      return scrollHeight - scrollPosition - height
    },
    saveScrollPosition () {
      const newScrollPositionFromBottom = this.getScrollPositionFromBottom()
      if (this.scrollPositionFromBottom !== newScrollPositionFromBottom) {
        this.scrollPositionFromBottom = newScrollPositionFromBottom
      }
    },
    restoreScrollPosition () {
      if (!this.scrollContainer || !this.startAtBottom) return
      const height = getElementHeight(this.scrollContainer)
      const scrollHeight = getScrollHeight(this.scrollContainer)
      const scrollPosition = scrollHeight - height - this.scrollPositionFromBottom
      setScrollPosition(this.scrollContainer, scrollPosition)
    },
    scrollToBottom () {
      this.$nextTick(() => {
        if (this.scrollContainer) {
          setScrollPosition(this.scrollContainer, getScrollHeight(this.scrollContainer))
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
      // if user scrolls to bottom and no more messages can be loaded, mark messages as read
      const isAtBottom = () => this.getScrollPositionFromBottom() < 100
      const hasMessages = () => this.conversation && this.conversation.messages && this.conversation.messages.length > 0
      if (!this.away && !this.conversation.canFetchFuture && hasMessages() && isAtBottom()) {
        const messages = this.conversation.messages
        const newestMessageId = messages[messages.length - 1].id
        this.markRead(newestMessageId)
      }
    },
  },
}
</script>
