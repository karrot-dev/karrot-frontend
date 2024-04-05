<template>
  <div
    class="column no-wrap"
    :class="inline && 'absolute-full'"
  >
    <div class="col-grow column no-wrap">
      <div
        ref="scroll"
        class="bg-white overscroll-contain"
        :class="inline && 'scroll'"
        style="flex-grow: 1;"
      >
        <slot name="before-chat-messages" />
        <KSpinner v-show="newestFirst && !hasNextPage && isFetchingNextPage" />
        <!-- explicit pagination for loading older messages -->
        <QBtn
          v-if="newestFirst && hasNextPage"
          :loading="isFetchingNextPage"
          flat
          no-caps
          class="full-width"
          @click="fetchNextPage()"
        >
          {{ $t('CONVERSATION.LOAD_EARLIER_MESSAGES') }}
        </QBtn>
        <QInfiniteScroll
          :disable="newestFirst || !hasNextPage"
          @load="maybeFetchNext"
        >
          <QList
            class="bg-white"
          >
            <ConversationMessage
              v-for="message in orderedMessages"
              :key="message.id"
              :message="message"
              :continuation="getIsContinuation(message.id)"
              :is-unread="getIsUnread(message.id)"
              slim
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
            <slot name="before-chat-compose" />
          </QList>
          <template #loading>
            <KSpinner v-if="oldestFirst" />
          </template>
        </QInfiniteScroll>
        <slot name="after-chat-messages" />
        <QScrollObserver @scroll="onScroll" />
      </div>
      <div>
        <ConversationCompose
          v-if="compose && !(oldestFirst && hasNextPage) && !conversation.isClosed"
          ref="compose"
          :status="sendStatus"
          slim
          outlined
          square
          :draft-key="conversation.id"
          :placeholder="messagePrompt"
          :is-participant="isParticipant"
          :input-style="{ maxHeight: '120px' }"
          class="q-pb-md"
          @submit="sendMessage"
        />
      </div>
    </div>
  </div>
</template>

<script>
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
  QBtn,
} from 'quasar'
import { computed, toRefs } from 'vue'

import { useConversationHelpers } from '@/messages/helpers'
import {
  useConversationSeenUpToMutation,
  useSendMessageMutation,
  useThreadSeenUpToMutation,
} from '@/messages/mutations'
import { useMessageContinuations } from '@/utils/mixins/groupedMessagesMixin'

import ConversationCompose from '@/messages/components/ConversationCompose.vue'
import ConversationMessage from '@/messages/components/ConversationMessage.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

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
    QBtn,
  },
  props: {
    conversation: { type: Object, default: null },
    messages: { type: Array, default: null },
    away: { type: Boolean, required: true },
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
    isFetchingNextPage: {
      type: Boolean,
      default: false,
    },
    fetchNextPage: {
      type: Function,
      default: () => {},
    },
  },
  setup (props) {
    const {
      conversation,
      messages,
    } = toRefs(props)

    const order = computed(() => {
      if (messages.value && messages.value.length > 1) {
        const firstMessage = messages.value[0]
        const lastMessage = messages.value[messages.value.length - 1]
        if (firstMessage.createdAt > lastMessage.createdAt) {
          return 'newest-first'
        }
      }
      return 'oldest-first' // default
    })
    const newestFirst = computed(() => order.value === 'newest-first')
    const oldestFirst = computed(() => !newestFirst.value) // always make it inverse

    const {
      getIsParticipant,
    } = useConversationHelpers()

    function getIsUnread (messageId) {
      if (!conversation.value) return false
      const threadMeta = conversation.value?.threadMeta
      if (threadMeta) { // Our "conversation" is a thread
        // Not part of it, don't keep track of unread
        if (!threadMeta.isParticipant) return false

        // We are a participant, but haven't seen anything yet, so they must all be unread
        if (!threadMeta.seenUpTo) return true

        return messageId > threadMeta.seenUpTo
      }
      else { // Our conversation is real conversation
        // notifications "none", means we don't keep track of it
        if (conversation.value.notifications === 'none') return false

        // We are a participant, but haven't seen anything yet, so they must all be unread
        if (!conversation.value.seenUpTo) return true

        return messageId > conversation.value.seenUpTo
      }
    }

    const {
      mutate: send,
      status: sendStatus,
    } = useSendMessageMutation()

    const { mutate: markSeenUpTo } = useConversationSeenUpToMutation()
    const { mutate: markThreadSeenUpTo } = useThreadSeenUpToMutation()

    const orderedMessages = computed(() => messages.value ? (oldestFirst.value ? messages.value : messages.value.slice().reverse()) : [])

    const { getIsContinuation } = useMessageContinuations(orderedMessages)

    return {
      order,
      orderedMessages,
      newestFirst,
      oldestFirst,

      isParticipant: computed(() => Boolean(props.conversation && getIsParticipant(props.conversation))),

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
        if (pending && this.newestFirst) this.scrollToBottom()
      },
    },
    'conversation.id' (id) {
      Object.assign(this, {
        newestMessageId: -1,
        oldestMessageId: -1,
        scrollPositionFromBottom: 0,
      })
    },
    orderedMessages (messages) {
      if (!messages || messages.length === 0) return
      // Jump to bottom when new messages added
      const newNewestMessage = messages[messages.length - 1]
      if (this.newestMessageId !== newNewestMessage.id) {
        this.newestMessageId = newNewestMessage.id
        if (this.maybeMarkRead()) {
          this.scrollToBottom()
        }
      }
    },
  },
  mounted () {
    // TODO: I removed a nextTick call here, seems to work... check?
    this.scrollContainer = this.inline ? this.$refs.scroll : getScrollTarget(this.$el)
    this.maybeMarkRead()
  },
  methods: {
    markRead (messageId) {
      if (!this.isParticipant) return // no marking as read if not part of it ...
      const isThreadReply = this.conversation.thread && this.messageId !== this.conversation.thread
      // TODO: check conversation.unreadMessageCount is available
      if (!isThreadReply && this.conversation.unreadMessageCount > 0) {
        this.markSeenUpTo({
          conversationId: this.conversation.id,
          messageId,
        })
      }
      // TODO: check threadMeta.unreadReplyCount available?
      if (isThreadReply && this.conversation.threadMeta && this.conversation.threadMeta.unreadReplyCount > 0) {
        this.markThreadSeenUpTo({
          threadId: this.conversation.thread,
          messageId,
        })
      }
    },
    maybeMarkRead () {
      // if user is at the bottom and no more messages can be loaded, mark messages as read
      const isAtBottom = () => this.getScrollPositionFromBottom() < 100
      const hasMessages = () => this.conversation && this.orderedMessages && this.orderedMessages.length > 0
      if (!this.away && !this.hasNextPage && hasMessages() && isAtBottom()) {
        const messages = this.orderedMessages
        const newestMessageId = messages[messages.length - 1].id
        this.markRead(newestMessageId)
        return true
      }
      return false
    },
    sendMessage ({ content, images, attachments }) {
      const data = this.conversation.thread
        ? {
            id: this.conversation.conversation,
            content,
            images,
            attachments,
            threadId: this.conversation.id,
          }
        : {
            id: this.conversation.id,
            content,
            images,
            attachments,
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
      if (!this.scrollContainer || this.oldestFirst) return
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
        // TODO: await?
        this.fetchPreviousPage()
      }
      this.maybeMarkRead()
    },
  },
}
</script>
