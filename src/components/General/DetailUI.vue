<template>
  <div class="Detail absolute-full column">
    <div
      v-if="!hasLoaded"
      class="full-width text-center generic-padding"
    >
      <q-spinner-dots :size="40" />
    </div>
    <template v-else>
      <div class="col-auto">
        <q-toolbar
          color="secondary"
        >
          <q-toolbar-title
            v-if="pickup"
          >
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
          <template v-else-if="user">
            <ProfilePicture
              :user="conversationPartner(conversation)"
              :size="40"
            />
            <q-toolbar-title>
              {{ user.displayName }}
            </q-toolbar-title>
          </template>
          <template v-else-if="conversation.thread">
            <q-icon name="fas fw-fw fa-comments" />
            <q-toolbar-title>
              {{ $t('CONVERSATION.REPLIES') }}
            </q-toolbar-title>
          </template>
          <NotificationToggle
            :value="notifications"
            :user="currentUser"
            in-toolbar
            @click="toggleNotifications"
          />
          <q-btn
            v-if="!$q.platform.is.mobile"
            flat
            round
            dense
            icon="close"
            @click="$emit('close')"
          />
        </q-toolbar>
        <div
          v-if="!user"
          class="k-participant-list row"
        >
          <div class="col">
            <ProfilePicture
              v-for="participant in conversation.participants"
              :key="participant.id"
              class="k-participant"
              :user="participant"
              :size="40"
            />
          </div>
        </div>
      </div>
      <ChatConversation
        v-if="conversation"
        :conversation="conversationWithMaybeReversedMessages"
        :away="away"
        :current-user="currentUser"
        :start-at-bottom="Boolean(user) || Boolean(pickup)"
        @send="$emit('send', arguments[0])"
        @mark="$emit('mark', arguments[0])"
        @toggleReaction="$emit('toggleReaction', arguments[0])"
        @saveMessage="$emit('saveMessage', arguments[0])"
        @fetchPast="$emit('fetchPast', arguments[0])"
        @fetchFuture="$emit('fetchFuture')"
      />
    </template>
  </div>
</template>

<script>
import ProfilePicture from '@/components/ProfilePictures/ProfilePicture'
import NotificationToggle from '@/components/Conversation/NotificationToggle'
import ChatConversation from '@/components/Conversation/ChatConversation'
import {
  QBtn,
  QToolbar,
  QToolbarTitle,
  QSpinnerDots,
  QIcon,
} from 'quasar'

export default {
  components: {
    ChatConversation,
    ProfilePicture,
    NotificationToggle,
    QBtn,
    QToolbar,
    QToolbarTitle,
    QSpinnerDots,
    QIcon,
  },
  props: {
    user: { type: Object, default: null },
    pickup: { type: Object, default: null },
    conversation: { type: Object, default: null },
    away: { type: Boolean, required: true },
    currentUser: { type: Object, default: null },
  },
  computed: {
    hasLoaded () {
      if (!this.conversation) return false
      const s = this.conversation.fetchStatus
      return !s.pending && !s.hasValidationErrors
    },
    conversationWithMaybeReversedMessages () {
      if (!this.conversation) return
      // TODO reverse message on server
      const messages = this.conversation.thread ? this.conversation.messages : this.conversation.messages.slice().reverse()
      return {
        ...this.conversation,
        messages,
      }
    },
    notifications () {
      return typeof this.conversation.emailNotifications !== 'undefined'
        ? this.conversation.emailNotifications
        : !this.conversation.threadMeta.muted
    },
  },
  methods: {
    conversationPartner (conversation) {
      return this.conversation && this.conversation.participants && this.conversation.participants.find(e => !e.isCurrentUser)
    },
    toggleNotifications () {
      const data = this.conversation.thread
        ? {
          threadId: this.conversation.thread,
          value: !this.notifications,
        }
        : {
          conversationId: this.conversation.id,
          value: !this.notifications,
        }
      this.$emit('toggleEmailNotifications', data)
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.Detail
  background-color white
.k-participant-list
  background-color #f5f5f5
  padding 0.3em
  padding-bottom 0
.k-participant
  display inline-block
  margin-right 0.3em
  margin-bottom 0.3em
</style>
