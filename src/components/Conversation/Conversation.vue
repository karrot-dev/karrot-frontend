<template>
  <div>
    <q-alert v-if="data.fetchStatus.hasValidationErrors">
      {{ data.fetchStatus.validationErrors }}
    </q-alert>
    <template v-if="hasLoaded">
      <q-infinite-scroll
        :handler="loadMore"
        ref="infiniteScroll">
        <q-list
          :highlight="false"
          class="bg-white desktop-margin"
        >
          <q-btn
            v-if="!user.mailVerified"
            class="actionButton"
            round
            small
            color="negative"
            @click="$router.push({ name: 'settings', hash: '#change-email' })"
          >
            <q-icon name="fa-exclamation-triangle" />
            <q-tooltip v-t="'WALL.VERIFY_EMAIL_FOR_NOTIFICATIONS'" />
          </q-btn>
          <q-btn
            v-else
            class="actionButton"
            round
            small
            :color="data.emailNotifications ? 'secondary' : 'negative'"
            @click="toggleNotifications"
          >
            <q-icon
              v-if="data.emailNotifications === true"
              name="fa-bell-o"
            />
            <q-icon
              v-else
              name="fa-bell-slash-o"
            />
            <q-tooltip v-t="data.emailNotifications ? 'WALL.DISABLE_NOTIFICATION_EMAILS' : 'WALL.ENABLE_NOTIFICATION_EMAILS'" />
          </q-btn>
          <ConversationCompose
            :status="data.sendStatus"
            @send="$emit('send', arguments[0])"
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
import { QBtn, QInfiniteScroll, QSpinnerDots, QList, QAlert, QItem, QIcon, QTooltip } from 'quasar'

export default {
  name: 'Conversation',
  components: {
    ConversationMessage,
    ConversationCompose,
    QBtn,
    QInfiniteScroll,
    QSpinnerDots,
    QList,
    QAlert,
    QItem,
    QIcon,
    QTooltip,
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
      required: true,
    },
  },
  methods: {
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
