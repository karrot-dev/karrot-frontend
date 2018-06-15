<template>
  <div class="SideConversation absolute-full column">
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
            Pickup conversation
            <span slot="subtitle">
              {{ $d(pickup.date, 'timeShort') }}
              <strong v-if="pickup.store">
                <router-link :to="{ name: 'store', params: { storeId: pickup.store.id }}">
                  {{ pickup.store.name }}
                </router-link>
              </strong>
              {{ $d(pickup.date, 'dateWithDayName') }}
            </span>
          </q-toolbar-title>
          <q-btn
            flat
            round
            dense
            icon="close"
            @click="$emit('close')"
          />
        </q-toolbar>
        <ProfilePicture
          v-for="participant in conversation.participants"
          :key="participant.id"
          :user="participant"
          :size="40"
        />
      </div>
      <div class="col bar relative-position">
        <div
          class="absolute-full scroll"
          ref="scroll"
        >
          <q-list
            no-border
            class="bg-white"
          >
            <ConversationMessage
              v-for="message in reversedMessages"
              :key="message.id"
              :message="message"
              @toggleReaction="toggleReaction"
            />
            <ConversationCompose
              ref="compose"
              :status="data.sendStatus"
              @send="sendMessage"
              :placeholder="messagePrompt"
              :user="user"
            />
          </q-list>
          <q-scroll-observable @scroll="saveScrollPosition" />
        </div>
      </div>
    </template>
    <q-resize-observable @resize="restoreScrollPosition" />
  </div>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import ConversationMessage from './ConversationMessage'
import ConversationCompose from './ConversationCompose'
import RandomArt from '@/components/General/RandomArt'
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
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    ConversationMessage,
    ConversationCompose,
    ProfilePicture,
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
  data () {
    return {
      newestMessageId: -1,
      oldestMessageId: -1,
      scrollPositionFromBottom: 0,
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      pickup: 'detail/pickup',
      conversation: 'detail/conversation',
    }),
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
    data () {
      return this.conversation
    },
    reversedMessages () {
      if (!this.conversation) return []
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return [...this.conversation.messages].reverse()
    },
  },
  watch: {
    'pickup.isUserMember' (isUserMember) {
      if (!isUserMember) this.$emit('close')
    },
    'conversation.messages' (messages) {
      if (messages.length === 0) return
      const newNewestMessageId = messages[0].id
      if (this.newestMessageId !== newNewestMessageId) {
        this.scrollToBottom()
        this.newestMessageId = newNewestMessageId
      }
      const newOldestMessageId = messages[messages.length - 1].id
      if (this.oldestMessageId !== newOldestMessageId) {
        this.oldestMessageId = newOldestMessageId
        this.$nextTick(() => {
          this.restoreScrollPosition()
        })
      }
    },
  },
  methods: {
    ...mapActions({
      send: 'conversations/send',
      toggleEmailNotifications: 'conversations/maybeToggleEmailNotifications',
      toggleReaction: 'conversations/toggleReaction',
    }),
    sendMessage (data) {
      this.send({
        id: this.conversation.id,
        messageData: data,
      })
    },
    toggleNotifications () {
      this.$emit('toggleEmailNotifications', {
        conversationId: this.data.id,
        value: !this.data.emailNotifications,
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
  },
}
</script>

<style scoped lang="stylus">
  .actionButton
    float right
    margin-top -25px
    margin-right 5px
</style>
