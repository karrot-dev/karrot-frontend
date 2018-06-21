<template>
  <div>
    <q-alert v-if="data.fetchStatus.hasValidationErrors">
      {{ data.fetchStatus.validationErrors }}
    </q-alert>
    <template v-if="hasLoaded">
      <q-infinite-scroll
        :handler="loadMore"
      >
        <q-list
          class="bg-white desktop-margin"
        >
          <NotificationToggle
            :value="data.emailNotifications"
            :user="user"
            class="actionButton hoverScale"
            @click="toggleNotifications"
          />
          <ConversationCompose
            :status="data.sendStatus"
            @submit="$emit('send', arguments[0])"
            :placeholder="messagePrompt"
            :user="user"
          />
          <q-alert
            v-if="data.unreadMessageCount > 0"
            color="secondary"
            icon="star"
          >
            {{ $tc('CONVERSATION.UNREAD_MESSAGES', data.unreadMessageCount, { count: data.unreadMessageCount }) }}
            <q-btn
              no-caps
              @click="$emit('markAllRead')"
              v-t="'CONVERSATION.MARK_READ'"
            />
          </q-alert>
          <ConversationMessage
            v-for="message in data.messages"
            :key="message.id"
            :message="message"
            @toggleReaction="$emit('toggleReaction', arguments[0])"
            @save="$emit('saveMessage', arguments[0])"
          />
        </q-list>
        <div
          slot="message"
          style="width: 100%; text-align: center"
        >
          <q-spinner-dots :size="40"/>
        </div>
      </q-infinite-scroll>
      <q-alert v-if="data.fetchMoreStatus.hasValidationErrors">
        {{ data.fetchMoreStatus.validationErrors }}
      </q-alert>
    </template>
  </div>
</template>

<script>
import ConversationMessage from './ConversationMessage'
import ConversationCompose from './ConversationCompose'
import NotificationToggle from './NotificationToggle'
import { QBtn, QInfiniteScroll, QSpinnerDots, QList, QAlert, QItem } from 'quasar'

export default {
  name: 'Conversation',
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
      required: true,
    },
    fetchMore: {
      type: Function,
      required: true,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  methods: {
    async loadMore (index, done) {
      if (!this.data.canLoadMore) {
        await this.$nextTick()
        done()
        return
      }
      await this.fetchMore()
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
      const s = this.data.fetchStatus
      return !s.pending && !s.hasValidationErrors
    },
    messagePrompt () {
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
  float right
  margin-top -25px
  margin-right 5px
</style>
