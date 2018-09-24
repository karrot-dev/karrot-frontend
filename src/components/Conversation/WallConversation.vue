<template>
  <div v-if="data">
    <q-infinite-scroll
      :handler="maybeFetchPast"
    >
      <q-list
        class="bg-white desktop-margin relative-position"
      >
        <template v-if="hasLoaded">
          <NotificationToggle
            :value="data.emailNotifications"
            :user="user"
            class="actionButton hoverScale"
            @click="toggleNotifications"
          />
          <ConversationCompose
            :status="data.sendStatus"
            @submit="$emit('send', { id: data.id, content: arguments[0] })"
            :placeholder="messagePrompt"
            :user="user"
            :slim="$q.platform.is.mobile"
            :autofocus="!$q.platform.is.mobile"
          />
          <q-alert
            v-if="data.unreadMessageCount > 0"
            color="secondary"
            icon="star"
            class="k-unread-alert"
          >
            <div class="row justify-between items-center">
              <small>{{ $tc('CONVERSATION.UNREAD_MESSAGES', data.unreadMessageCount, { count: data.unreadMessageCount }) }}</small>
              <q-btn
                no-caps
                outline
                size="sm"
                @click="$emit('markAllRead', data.id)"
                v-t="'CONVERSATION.MARK_READ'"
              />
            </div>
          </q-alert>
          <ConversationMessage
            v-for="message in data.messages"
            :key="message.id"
            :message="message"
            @toggleReaction="$emit('toggleReaction', arguments[0])"
            @save="$emit('saveMessage', arguments[0])"
            @openThread="$emit('openThread', message)"
          />
        </template>
        <div
          v-if="data.fetchStatus.pending || data.fetchPastStatus.pending"
          style="width: 100%; text-align: center">
          <q-spinner-dots :size="40"/>
        </div>
      </q-list>
    </q-infinite-scroll>
  </div>
</template>

<script>
import ConversationMessage from './ConversationMessage'
import ConversationCompose from './ConversationCompose'
import NotificationToggle from './NotificationToggle'
import { QBtn, QInfiniteScroll, QSpinnerDots, QList, QAlert, QItem } from 'quasar'

export default {
  name: 'WallConversation',
  components: {
    ConversationMessage,
    ConversationCompose,
    NotificationToggle,
    QBtn,
    QInfiniteScroll,
    QSpinnerDots,
    QList,
    QAlert,
    QItem,
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
    toggleNotifications () {
      this.$emit('toggleEmailNotifications', {
        conversationId: this.data.id,
        value: !this.data.emailNotifications,
      })
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
}
</script>

<style scoped lang="stylus">
.actionButton
  z-index 1
  position absolute
  top -24px
  right 6px
.k-unread-alert >>>
  .q-alert-content, .q-alert-side
    padding-top 6px
    padding-bottom 6px
</style>
