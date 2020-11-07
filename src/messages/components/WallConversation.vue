<template>
  <div>
    <QInfiniteScroll
      :disable="conversation && !canFetchPast"
      @load="maybeFetchPast"
    >
      <QList
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
            :status="null"
            :placeholder="messagePrompt"
            :user="user"
            :slim="$q.platform.is.mobile"
            :is-participant="conversation.isParticipant"
            :draft-key="conversation.id"
            @submit="$emit('send', { id: conversation.id, ...arguments[0] })"
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
            @toggle-reaction="$emit('toggle-reaction', arguments[0])"
            @save="$emit('save-message', arguments[0])"
            @open-thread="$emit('open-thread', message)"
          />
        </template>
        <KSpinner v-show="!conversation || fetchStatus.pending.value || fetchPastStatus.pending.value" />
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
    fetchPast: {
      type: Function,
      default: null,
    },
    fetchStatus: {
      type: Object,
      required: true,
    },
    fetchPastStatus: {
      type: Object,
      required: true,
    },
    canFetchPast: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: null,
    },
    messages: {
      type: Array,
      required: true,
    },
  },
  data () {
    return {
      data: null,
    }
  },
  computed: {
    hasLoaded () {
      return Boolean(this.conversation)
      // TODO: reimplement
      // eslint-disable-next-line no-unreachable
      if (!this.data) return false
      const s = this.data.fetchStatus
      return !s.pending && !s.hasValidationErrors
    },
    messagePrompt () {
      if (!this.data) return ''
      if (this.data.messages.length > 0) {
        return this.$t('WALL.WRITE_MESSAGE')
      }
      else {
        return this.$t('WALL.WRITE_FIRST_MESSAGE')
      }
    },
  },
  methods: {
    async maybeFetchPast (index, done) {
      if (!this.conversation || !this.fetchPast || !this.canFetchPast) {
        await this.$nextTick()
        done()
        return
      }
      await this.fetchPast()
      done()
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

<style scoped lang="stylus">
.actionButton
  position absolute
  top -32px
  right 6px
  z-index 1

>>> .q-banner__avatar
  align-self center
</style>
