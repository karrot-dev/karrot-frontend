<template>
  <div class="Detail absolute-full column">
    <q-alert v-if="conversation && conversation.fetchStatus.hasValidationErrors">
      {{ conversation.fetchStatus.validationErrors }}
    </q-alert>
    <div
      v-if="!hasLoaded"
      class="full-width text-center generic-padding"
    >
      <q-spinner-dots :size="40" />
    </div>
    <template v-if="hasLoaded">
      <div class="col-auto">
        <q-toolbar
          color="secondary"
        >
          <q-toolbar-title>
            <span
              v-if="!$q.platform.is.mobile"
              v-t="'GROUP.PICKUP'"
            >&nbsp;</span>
            <strong>{{ $d(pickup.date, 'dayAndTime') }}</strong>
            <span slot="subtitle">
              <strong v-if="pickup.store">
                <router-link :to="{ name: 'store', params: { storeId: pickup.store.id }}">
                  {{ pickup.store.name }}
                </router-link>
              </strong>
              {{ $d(pickup.date, 'dateShort') }}
            </span>
          </q-toolbar-title>
          <q-btn
            v-if="!$q.platform.is.mobile"
            flat
            round
            dense
            icon="close"
            @click="$emit('close')"
          />
        </q-toolbar>
        <div class="k-participant-list row">
          <div class="col">
            <ProfilePicture
              v-for="participant in conversation.participants"
              :key="participant.id"
              class="k-participant"
              :user="participant"
              :size="40"
            />
          </div>
          <NotificationToggle
            :value="conversation.emailNotifications"
            :user="user"
            @click="toggleNotifications"
          />
        </div>
      </div>
      <div class="col bar relative-position">
        <div
          class="absolute-full scroll"
          ref="scroll"
        >
          <div
            v-if="fetchingMore"
            class="full-width text-center generic-padding"
          >
            <q-spinner-dots :size="40" />
          </div>
          <q-list
            no-border
            class="bg-white"
          >
            <ConversationMessage
              v-for="message in reversedMessages"
              :key="message.id"
              :message="message"
              slim
              @toggleReaction="$emit('toggleReaction', arguments[0])"
              @save="$emit('saveMessage', arguments[0])"
            />
            <ConversationCompose
              ref="compose"
              :status="conversation.sendStatus"
              slim
              @submit="sendMessage"
              :placeholder="messagePrompt"
              :user="user"
            />
          </q-list>
          <q-scroll-observable @scroll="onScroll" />
        </div>
      </div>
    </template>
    <q-resize-observable @resize="restoreScrollPosition" />
  </div>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import ConversationMessage from '@/components/Conversation/ConversationMessage'
import ConversationCompose from '@/components/Conversation/ConversationCompose'
import RandomArt from '@/components/General/RandomArt'
import NotificationToggle from '@/components/Conversation/NotificationToggle'
import {
  scroll,
  QBtn,
  QInfiniteScroll,
  QSpinnerDots,
  QList,
  QAlert,
  QItem,
  QIcon,
  QTooltip,
  QScrollArea,
  QToolbar,
  QToolbarTitle,
  QResizeObservable,
  QScrollObservable,
} from 'quasar'
const { getScrollHeight, getScrollPosition, setScrollPosition } = scroll

export default {
  components: {
    ConversationMessage,
    ConversationCompose,
    ProfilePicture,
    NotificationToggle,
    RandomArt,
    QBtn,
    QInfiniteScroll,
    QSpinnerDots,
    QList,
    QAlert,
    QItem,
    QIcon,
    QTooltip,
    QScrollArea,
    QToolbar,
    QToolbarTitle,
    QResizeObservable,
    QScrollObservable,
  },
  props: {
    user: { type: Object, default: null },
    pickup: { type: Object, default: null },
    conversation: { type: Object, default: null },
    away: { type: Boolean, required: true },
  },
  data () {
    return {
      newestMessageId: -1,
      oldestMessageId: -1,
      scrollPositionFromBottom: 0,
    }
  },
  computed: {
    hasLoaded () {
      if (!this.pickup || !this.conversation) return false
      const s = this.conversation.fetchStatus
      return !s.pending && !s.hasValidationErrors
    },
    messagePrompt () {
      if (this.conversation.messages.length > 0) {
        return this.$t('WALL.WRITE_MESSAGE')
      }
      else {
        return this.$t('WALL.WRITE_FIRST_MESSAGE')
      }
    },
    reversedMessages () {
      if (!this.conversation) return []
      return this.conversation.messages.slice().reverse()
    },
    fetchingMore () {
      return this.conversation.fetchMoreStatus.pending
    },
  },
  watch: {
    away (away) {
      if (!away) this.markRead(this.newestMessageId)
    },
    hasLoaded (hasLoaded) {
      if (hasLoaded) this.scrollToBottom()
    },
    'pickup.isUserMember' (isUserMember) {
      if (!isUserMember) this.$emit('close')
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
      const newNewestMessageId = messages[0].id
      if (this.newestMessageId !== newNewestMessageId) {
        this.scrollToBottom()
        this.newestMessageId = newNewestMessageId
        if (!this.away) this.markRead(this.newestMessageId)
      }
      // Retain position when old message added
      const newOldestMessageId = messages[messages.length - 1].id
      if (this.oldestMessageId !== newOldestMessageId) {
        this.saveScrollPosition()
        this.oldestMessageId = newOldestMessageId
        this.$nextTick(() => {
          this.restoreScrollPosition()
        })
      }
    },
  },
  methods: {
    markRead (messageId) {
      if (!this.conversation) return
      if (this.conversation.unreadMessageCount > 0) {
        this.$emit('mark', {
          id: this.conversation.id,
          seenUpTo: messageId,
        })
      }
    },
    sendMessage (content) {
      this.$emit('send', {
        id: this.conversation.id,
        content,
      })
    },
    toggleNotifications () {
      this.$emit('toggleEmailNotifications', {
        conversationId: this.conversation.id,
        value: !this.conversation.emailNotifications,
      })
    },
    saveScrollPosition () {
      if (!this.$refs.scroll) return
      const { height } = this.$refs.scroll.getBoundingClientRect()
      const scrollHeight = getScrollHeight(this.$refs.scroll)
      const scrollPosition = getScrollPosition(this.$refs.scroll)
      const newScrollPositionFromBottom = scrollHeight - scrollPosition - height
      if (this.scrollPositionFromBottom !== newScrollPositionFromBottom) {
        this.scrollPositionFromBottom = newScrollPositionFromBottom
      }
    },
    restoreScrollPosition () {
      if (!this.$refs.scroll) return
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
    onScroll ({ position }) {
      if (position < 50) {
        if (!this.fetchingMore && this.conversation.canLoadMore) {
          this.$emit('fetchMore', this.conversation.id)
        }
      }
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.Detail
  background-color white
.actionButton
  float right
  margin-top -25px
  margin-right 5px
.k-participant-list
  background-color #f5f5f5
  padding 0.3em
  padding-bottom 0
.k-participant
  display inline-block
  margin-right 0.3em
  margin-bottom 0.3em
</style>
