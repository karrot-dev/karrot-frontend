<template>
  <div class="SideConversation absolute-full column">
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
          <q-scroll-observable @scroll="onScroll" />
        </div>
      </div>
    </template>
    <q-resize-observable @resize="onResize" />
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
const { setScrollPosition } = scroll
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
      mostRecentMessageId: -1,
      scrollPositionFromBottom: 0,
    }
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      conversation: 'conversations/active',
      allPickups: 'pickups/all',
    }),
    hasLoaded () {
      if (!this.pickup) return false
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
      // eslint-disable-next-line vue/no-side-effects-in-computed-properties
      return [...this.conversation.messages].reverse()
    },
    pickup () {
      return this.allPickups[0]
    },
  },
  watch: {
    'conversation.messages' (messages) {
      if (messages.length === 0) return
      const newMostRecentMessageId = messages[0].id
      if (this.mostRecentMessageId !== newMostRecentMessageId) {
        this.scrollToBottom()
        this.mostRecentMessageId = newMostRecentMessageId
      }
    },
  },
  methods: {
    ...mapActions({
      join: 'pickups/join',
      leave: 'pickups/leave',
      send: 'conversations/sendInActiveConversation',
      markAllRead: 'conversations/markAllReadInActiveConversation',
      toggleEmailNotifications: 'conversations/maybeToggleEmailNotifications',
      toggleReaction: 'conversations/toggleReaction',
      fetchMore: 'conversations/fetchMoreForActiveConversation',
    }),
    sendMessage (data) {
      this.send(data)
    },
    loadMore (index, done) {
      if (!this.data.canLoadMore) {
        done()
        return
      }
      this.fetchMore().then(done)
    },
    toggleNotifications () {
      this.$emit('toggleEmailNotifications', {
        conversationId: this.data.id,
        value: !this.data.emailNotifications,
      })
    },
    onResize () {
      if (!this.$refs.scroll) return
      const { height } = this.$refs.scroll.getBoundingClientRect()
      const { scrollHeight } = this.$refs.scroll
      const scrollTop = scrollHeight - height - this.scrollPositionFromBottom
      setScrollPosition(this.$refs.scroll, scrollTop)
    },
    onScroll () {
      if (!this.$refs.scroll) return
      const { height } = this.$refs.scroll.getBoundingClientRect()
      const { scrollHeight, scrollTop } = this.$refs.scroll
      const newScrollPositionFromBottom = scrollHeight - scrollTop - height
      if (this.scrollPositionFromBottom !== newScrollPositionFromBottom) {
        this.scrollPositionFromBottom = newScrollPositionFromBottom
      }
    },
    scrollToBottom () {
      this.$nextTick(() => {
        if (this.$refs.scroll) {
          setScrollPosition(this.$refs.scroll, this.$refs.scroll.scrollHeight)
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
