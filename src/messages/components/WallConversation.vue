<template>
  <div>
    <QInfiniteScroll
      :disable="data && !data.canFetchPast"
      @load="maybeFetchPast"
    >
      <QList
        class="bg-white desktop-margin relative-position q-pb-md"
        bordered
      >
        <template v-if="hasLoaded">
          <NotificationToggle
            class="actionButton"
            :muted="data.muted"
            :is-participant="data.isParticipant"
            :user="user"
            @set="setNotifications"
          />
          <ConversationCompose
            :status="data.sendStatus"
            :placeholder="messagePrompt"
            :user="user"
            :slim="$q.platform.is.mobile"
            :is-participant="data.isParticipant"
            @submit="$emit('send', { id: data.id, content: arguments[0] })"
          />
          <QBanner
            v-if="data.isParticipant && data.unreadMessageCount > 0"
            class="bg-secondary text-white q-mt-sm"
            style="min-height: unset"
          >
            <template v-slot:avatar>
              <QIcon
                name="star"
                color="white"
                size="1.5em"
              />
            </template>
            <div class="row justify-between items-center">
              <small>
                {{ $tc('CONVERSATION.UNREAD_MESSAGES', data.unreadMessageCount, {
                  count: data.unreadMessageCount > 99 ? '99+' : data.unreadMessageCount,
                }) }}
              </small>
              <QBtn
                v-t="'CONVERSATION.MARK_READ'"
                no-caps
                outline
                size="sm"
                @click="$emit('markAllRead', data.id)"
              />
            </div>
          </QBanner>
          <ConversationMessage
            v-for="message in data.messages"
            :key="message.id"
            :message="message"
            @toggleReaction="$emit('toggleReaction', arguments[0])"
            @save="$emit('saveMessage', arguments[0])"
            @openThread="$emit('openThread', message)"
          />
        </template>
        <KSpinner v-show="!data || data.fetchStatus.pending || data.fetchPastStatus.pending" />
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
    data: {
      type: Object,
      default: null,
    },
    fetchPast: {
      type: Function,
      default: null,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  computed: {
    hasLoaded () {
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
      if (!this.data || !this.fetchPast || !this.data.canFetchPast) {
        await this.$nextTick()
        done()
        return
      }
      await this.fetchPast(this.data.id)
      done()
    },
    setNotifications (value) {
      this.$emit('saveConversation', {
        conversationId: this.data.id,
        value,
      })
    },
  },
}
</script>

<style scoped lang="stylus">
.actionButton
  position absolute
  top -24px
  right 6px;
  z-index 1
</style>
