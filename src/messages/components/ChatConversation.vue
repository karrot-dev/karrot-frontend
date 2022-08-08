<template>
  <div
    ref="scroll"
    class="bg-white"
    :class="inline && 'absolute-full scroll'"
  >
    <slot name="before-chat-messages" />
    <KSpinner v-show="isFetchingPreviousPage" />
    <QInfiniteScroll
      :disable="!hasNextPage"
      @load="maybeFetchNext"
    >
      <QList
        class="bg-white"
      >
        <ConversationMessage
          v-for="message in messages"
          :key="message.id"
          :message="message"
          :continuation="getIsContinuation(message.id)"
          :is-unread="getIsUnread(message.id)"
          slim
        />
        <slot name="before-chat-compose" />
        <ConversationCompose
          v-if="compose && !hasNextPage && !conversation.isClosed"
          ref="compose"
          :status="sendStatus"
          slim
          filled
          square
          :draft-key="conversation.id"
          :placeholder="messagePrompt"
          :is-participant="isParticipant"
          class="q-pb-md"
          @submit="sendMessage"
        />
        <QItem
          v-if="conversation.isClosed"
          class="q-mt-md"
        >
          <QItemSection avatar>
            <QAvatar
              color="grey-5"
              text-color="white"
              icon="fas fa-lock"
            />
          </QItemSection>
          <QItemSection>
            <QItemLabel class="text-body2">
              {{ $t('CONVERSATION.CLOSED') }}
            </QItemLabel>
          </QItemSection>
        </QItem>
      </QList>
      <template #loading>
        <KSpinner />
      </template>
    </QInfiniteScroll>
    <slot name="after-chat-messages" />
    <QScrollObserver @scroll="onScroll" />
  </div>
</template>

<script>
import { computed, toRef } from 'vue'

import ConversationMessage from '@/messages/components/ConversationMessage'
import ConversationCompose from '@/messages/components/ConversationCompose'
import KSpinner from '@/utils/components/KSpinner'
import { useMessageContinuations } from '@/utils/mixins/groupedMessagesMixin'
import {
  scroll,
  dom,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QAvatar,
  QScrollObserver,
  QInfiniteScroll,
} from 'quasar'
import {
  useConversationSeenUpToMutation,
  useSendMessageMutation,
  useThreadSeenUpToMutation,
} from '@/messages/mutations'
import { useConversationHelpers } from '@/messages/helpers'
const { getScrollHeight, getVerticalScrollPosition, setVerticalScrollPosition, getScrollTarget } = scroll
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
    QItemSection,
    QItemLabel,
    QAvatar,
    QScrollObserver,
    QInfiniteScroll,
  },
  props: {
    conversation: { type: Object, default: null },
    messages: { type: Array, default: null },
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
    pending: {
      type: Boolean,
      default: false,
    },
    hasNextPage: {
      type: Boolean,
      default: false,
    },
    hasPreviousPage: {
      type: Boolean,
      default: false,
    },
    isFetchingNextPage: {
      type: Boolean,
      default: false,
    },
    isFetchingPreviousPage: {
      type: Boolean,
      default: false,
    },
    fetchNextPage: {
      type: Function,
      default: () => {},
    },
    fetchPreviousPage: {
      type: Function,
      default: () => {},
    },
  },
  setup (props) {
    const {
      getIsParticipant,
    } = useConversationHelpers()

    function getIsUnread (messageId) {
      const conversationOrThreadMeta = props.conversation?.threadMeta || props.conversation
      if (!conversationOrThreadMeta) return false
      if (conversationOrThreadMeta.notifications === 'none') {
        // don't show unread status if user is not participant
        // does not apply to thread replies
        return false
      }
      if (!conversationOrThreadMeta.seenUpTo) return true
      return messageId > conversationOrThreadMeta.seenUpTo
    }

    const { getIsContinuation } = useMessageContinuations(toRef(props, 'messages'))


    const {
      mutate: send,
      status: sendStatus,
    } = useSendMessageMutation()

    const { mutate: markSeenUpTo } = useConversationSeenUpToMutation()
    const { mutate: markThreadSeenUpTo } = useThreadSeenUpToMutation()

    return {
      isParticipant: computed(() => props.conversation && getIsParticipant(props.conversation)),

      getIsContinuation,
      getIsUnread,

      send,
      sendStatus,

      markSeenUpTo,
      markThreadSeenUpTo,
    }
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
    messagePrompt () {
      if (this.conversation.thread) {
        return this.$t('CONVERSATION.REPLY_TO_MESSAGE')
      }
      if (this.messages.length > 0) {
        return this.$t('WALL.WRITE_MESSAGE')
      }
      return this.$t('WALL.WRITE_FIRST_MESSAGE')
    },
  },
  watch: {
    away (away) {
      if (!away && !this.hasNextPage) {
        this.markRead(this.newestMessageId)
      }
    },
    pending: {
      immediate: true,
      handler (pending) {
        if (pending && this.startAtBottom) this.scrollToBottom()
      },
    },
    'conversation.id' (id) {
      Object.assign(this, {
        newestMessageId: -1,
        oldestMessageId: -1,
        scrollPositionFromBottom: 0,
      })
    },
    messages (messages) {
      if (!messages || messages.length === 0) return
      // Jump to bottom when new messages added
      const newNewestMessage = messages[messages.length - 1]

      if (this.newestMessageId !== newNewestMessage.id) {
        const scrollPosition = this.getScrollPositionFromBottom()
        this.newestMessageId = newNewestMessage.id
        if (scrollPosition < 100 && !this.away && !this.hasNextPage) {
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
    isFetchingNextPage (fetching) {
      if (fetching === false && this.hideBottomSpinner) {
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
        this.markSeenUpTo({
          conversationId: this.conversation.id,
          messageId,
        })
      }
      if (isThreadReply && this.conversation.threadMeta && this.conversation.threadMeta.unreadReplyCount > 0) {
        this.markThreadSeenUpTo({
          threadId: this.conversation.thread,
          messageId,
        })
      }
    },
    sendMessage ({ content, images }) {
      const data = this.conversation.thread
        ? {
            id: this.conversation.conversation,
            content,
            images,
            threadId: this.conversation.id,
          }
        : {
            id: this.conversation.id,
            content,
            images,
          }
      this.send(data)
    },
    getScrollPositionFromBottom () {
      if (!this.scrollContainer) return
      const height = getElementHeight(this.scrollContainer)
      const scrollHeight = getScrollHeight(this.scrollContainer)
      const scrollPosition = getVerticalScrollPosition(this.scrollContainer)
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
      setVerticalScrollPosition(this.scrollContainer, scrollPosition)
    },
    scrollToBottom () {
      this.$nextTick(() => {
        if (this.scrollContainer) {
          setVerticalScrollPosition(this.scrollContainer, getScrollHeight(this.scrollContainer))
        }
      })
    },
    async maybeFetchNext (index, done) {
      if (!this.hasNextPage) {
        await this.$nextTick()
        done(!this.hasNextPage)
        return
      }
      await this.fetchNextPage()
      done(!this.hasNextPage)
    },
    onScroll ({ position }) {
      if (position.top < 50 && !this.isFetchingPreviousPage && this.hasPreviousPage) {
        // this.$emit('fetch-previous')
        // TODO: await?
        this.fetchPreviousPage()
      }
      // if user scrolls to bottom and no more messages can be loaded, mark messages as read
      const isAtBottom = () => this.getScrollPositionFromBottom() < 100
      const hasMessages = () => this.conversation && this.messages && this.messages.length > 0
      if (!this.away && !this.hasNextPage && hasMessages() && isAtBottom()) {
        const messages = this.messages
        const newestMessageId = messages[messages.length - 1].id
        this.markRead(newestMessageId)
      }
    },
  },
}
</script>
