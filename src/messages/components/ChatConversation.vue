<template>
  <div
    ref="scroll"
    :class="inline && 'absolute-full scroll'"
  >
    <slot name="beforeChatMessages" />
    <KSpinner v-show="fetchingPast" />
    <QInfiniteScroll :handler="maybeFetchFuture">
      <QList
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
          v-if="compose && !conversation.canFetchFuture && !conversation.isClosed"
          ref="compose"
          :status="conversation.sendStatus"
          slim
          :placeholder="messagePrompt"
          :is-participant="conversation.isParticipant"
          @submit="sendMessage"
        />
        <QItem
          v-if="conversation.isClosed"
          class="q-mt-md"
        >
          <QItemSide
            icon="fas fa-lock"
            color="light"
            inverted
          />
          <QItemMain
            class="q-body-1"
            :label="$t('CONVERSATION.CLOSED')"
            label-lines="3"
          />
        </QItem>
      </QList>
      <KSpinner slot="message" />
    </QInfiniteScroll>
    <slot name="afterChatMessages" />
    <QScrollObservable @scroll="onScroll" />
  </div>
</template>

<script>
import ConversationMessage from '@/messages/components/ConversationMessage'
import ConversationCompose from '@/messages/components/ConversationCompose'
import KSpinner from '@/utils/components/KSpinner'
import {
  scroll,
  dom,
  QList,
  QItem,
  QItemSide,
  QItemMain,
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
    KSpinner,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    QScrollObservable,
    QInfiniteScroll,
  },
  props: {
    conversation: { type: Object, default: null },
    away: { type: Boolean, required: true },
    currentUser: { type: Object, default: null },
    startAtBottom: { type: Boolean, default: false },
    compose: {
      type: Boolean,
      default: false,
    },
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
  mounted () {
    this.$nextTick(() => {
      this.scrollContainer = this.inline ? this.$refs.scroll : getScrollTarget(this.$el)
    })
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
