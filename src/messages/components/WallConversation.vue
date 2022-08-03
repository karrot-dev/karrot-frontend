<template>
  <div>
    <QInfiniteScroll
      :disable="conversation && !canFetchPast"
      @load="maybeFetchPast"
    >
      <QList
        ref="messagesList"
        class="bg-white desktop-margin relative-position q-pb-md"
        bordered
      >
        <template v-if="hasLoaded">
          <NotificationToggle
            class="actionButton"
            :muted="conversation.muted"
            :is-participant="conversation.isParticipant"
            :user="user"
            @set="setNotifications"
          />
          <ConversationCompose
            :status="sendStatus"
            :placeholder="messagePrompt"
            :user="user"
            :slim="$q.platform.is.mobile"
            :is-participant="conversation.isParticipant"
            :draft-key="conversation.id"
            @submit="message => $emit('send', { id: conversation.id, ...message })"
          />
          <QBanner
            v-if="conversation.isParticipant && conversation.unreadMessageCount > 0"
            class="bg-secondary text-white q-mt-sm"
            style="min-height: unset"
          >
            <template #avatar>
              <QIcon
                name="star"
                color="white"
                size="1.5em"
              />
            </template>
            <div class="row justify-between items-center">
              <small>
                {{ $tc('CONVERSATION.UNREAD_MESSAGES', conversation.unreadMessageCount, {
                  count: conversation.unreadMessageCount > 99 ? '99+' : conversation.unreadMessageCount,
                }) }}
              </small>
              <QBtn
                no-caps
                outline
                size="sm"
                @click="$emit('mark-all-read', conversation.id)"
              >
                <span v-t="'CONVERSATION.MARK_READ'" />
              </QBtn>
            </div>
          </QBanner>
          <ConversationMessage
            v-for="message in messages"
            :key="message.id"
            :message="message"
            @toggle-reaction="(...args) => $emit('toggle-reaction', ...args)"
            @save="(...args) => $emit('save-message', ...args)"
            @open-thread="$emit('open-thread', message)"
          />
        </template>
        <KSpinner v-show="pending || pastPending" />
      </QList>
    </QInfiniteScroll>
  </div>
</template>

<script>
import ConversationMessage from './ConversationMessage'
import ConversationCompose from './ConversationCompose'
import NotificationToggle from './NotificationToggle'
import KSpinner from '@/utils/components/KSpinner'
import {
  QBtn,
  QInfiniteScroll,
  QList,
  QBanner,
  QIcon,
} from 'quasar'

export default {
  name: 'WallConversation',
  components: {
    ConversationMessage,
    ConversationCompose,
    NotificationToggle,
    KSpinner,
    QBtn,
    QInfiniteScroll,
    QList,
    QBanner,
    QIcon,
  },
  props: {
    // data: {
    //   type: Object,
    //   default: null,
    // },
    conversation: {
      type: Object,
      default: null,
    },
    messages: {
      type: Array,
      default: () => [],
    },
    pending: {
      type: Boolean,
      default: false,
    },
    canFetchPast: {
      type: Boolean,
      default: false,
    },
    fetchPast: {
      type: Function,
      default: null,
    },
    pastPending: {
      type: Boolean,
      default: null,
    },
    user: {
      type: Object,
      default: null,
    },
    sendStatus: {
      type: Object,
      default: null,
    },
  },
  emits: [
    'send',
    'mark-all-read',
    'toggle-reaction',
    'save-message',
    'open-thread',
    'save-conversation',
  ],
  computed: {
    hasLoaded () {
      if (!this.conversation) return false
      return !this.pending
    },
    messagePrompt () {
      if (!this.conversation) return ''
      if (this.messages.length > 0) {
        return this.$t('WALL.WRITE_MESSAGE')
      }
      else {
        return this.$t('WALL.WRITE_FIRST_MESSAGE')
      }
    },
  },
  watch: {
    hasLoaded (val) {
      if (val) {
        const hash = this.$route.hash
        if (hash === '#messages') {
          const ref = this.$refs.messagesList
          if (ref) ref.$el.scrollIntoView()
        }
      }
    },
  },
  methods: {
    async maybeFetchPast (index, done) {
      console.log('maybe fetch?')
      if (!this.conversation || !this.fetchPast || !this.canFetchPast) {
        await this.$nextTick()
        done(!this.canFetchPast)
        return
      }
      await this.fetchPast()
      done(!this.canFetchPast)
    },
    setNotifications (value) {
      this.$emit('save-conversation', {
        conversationId: this.conversation.id,
        value,
      })
    },
  },
}
</script>

<style scoped lang="sass">
.actionButton
  position: absolute
  top: -32px
  right: 6px
  z-index: 1

::v-deep(.q-banner__avatar)
  align-self: center
</style>
