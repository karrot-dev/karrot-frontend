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
                <router-link :to="{ name: 'store', params: { groupId: pickup.group.id, storeId: pickup.store.id }}">
                  {{ pickup.store.name }}
                </router-link>
              </strong>
              {{ $d(pickup.date, 'dateShort') }}
            </span>
          </q-toolbar-title>
          <template v-else-if="user">
            <ProfilePicture
              :user="conversationPartner(conversation)"
              :size="$q.platform.is.mobile ? 25 : 40"
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
          <template v-else-if="application">
            <ProfilePicture
              v-if="!application.user.isCurrentUser"
              :user="application.user"
              :size="$q.platform.is.mobile ? 25 : 40"
            />
            <q-toolbar-title>
              <router-link :to="applicationLink">
                <span v-t="'APPLICATION.APPLICATION'" />
              </router-link>
              <span slot="subtitle">
                {{ application.user.isCurrentUser ? application.group.name : application.user.displayName }}
              </span>
              <small>
                <q-icon
                  v-if="application.status === 'accepted'"
                  name="fas fa-fw fa-check"
                  :title="$t('GROUP.ADDED_BY', { userName: application.decidedBy.displayName })"
                />
                <q-icon
                  v-else-if="application.status === 'pending'"
                  name="fas fa-fw fa-hourglass-half"
                  :title="application.user.isCurrentUser && $t('JOINGROUP.APPLICATION_PENDING')"
                />
                <q-icon
                  v-else-if="application.status === 'declined'"
                  name="fas fa-fw fa-times"
                  :title="$t('GROUP.DECLINED_BY', { userName: application.decidedBy.displayName })"
                />
                <q-icon
                  v-else-if="application.status === 'withdrawn'"
                  name="fas fa-fw fa-trash-alt"
                  :title="$t('APPLICATION.WITHDRAWN', { relativeDate: dateInWords(application.decidedAt) })"
                />
              </small>
            </q-toolbar-title>
            <q-btn
              flat
              round
              dense
              icon="help_outline"
              @click="applicationInfo"
            />
          </template>
          <NotificationToggle
            v-if="notifications !== null"
            :value="notifications"
            :user="currentUser"
            in-toolbar
            @click="toggleNotifications"
            :size="$q.platform.is.mobile ? 'sm' : 'md'"
          />
          <q-btn
            v-if="!$q.platform.is.mobile"
            flat
            round
            dense
            icon="close"
            @click="$emit('close')"
            :title="$t('BUTTON.CLOSE')"
          />
        </q-toolbar>
        <div
          v-if="pickup || conversation.thread"
          class="k-participant-list row"
        >
          <div class="col">
            <ProfilePicture
              v-for="participant in participants"
              :key="participant.id"
              class="k-participant"
              :user="participant"
              :size="$q.platform.is.mobile ? 20 : 35"
            />
          </div>
        </div>
      </div>
      <q-collapsible
        opened
        v-if="application"
        class="bg-grey-2"
      >
        <template slot="header">
          <b>{{ $t('APPLICATION.INITIAL') }}</b>
        </template>
        <div class="q-ma-sm q-pa-sm bg-white">
          <span class="text-bold text-secondary uppercase">{{ application.group.name }}</span>
          <span class="message-date">
            <small class="text-weight-light">
              <DateAsWords :date="application.createdAt" />
            </small>
          </span>
          <Markdown :source="application.questions" />
        </div>
        <div class="q-ma-sm q-pa-sm bg-white">
          <span class="text-bold text-secondary uppercase">{{ application.user.displayName }}</span>
          <span class="message-date">
            <small class="text-weight-light">
              <DateAsWords :date="application.createdAt" />
            </small>
          </span>
          <Markdown :source="application.answers" />
        </div>
      </q-collapsible>
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
import Markdown from '@/components/Markdown'
import DateAsWords from '@/components/General/DateAsWords'
import dateFnsHelper from '@/services/dateFnsHelper'

import {
  Dialog,
  QBtn,
  QToolbar,
  QToolbarTitle,
  QSpinnerDots,
  QIcon,
  QCollapsible,
} from 'quasar'

export default {
  components: {
    ChatConversation,
    ProfilePicture,
    NotificationToggle,
    Markdown,
    DateAsWords,
    QBtn,
    QToolbar,
    QToolbarTitle,
    QSpinnerDots,
    QIcon,
    QCollapsible,
  },
  props: {
    user: { type: Object, default: null },
    pickup: { type: Object, default: null },
    application: { type: Object, default: null },
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
      if (this.conversation.thread && this.conversation.threadMeta) {
        return !this.conversation.threadMeta.muted
      }
      if (typeof this.conversation.emailNotifications !== 'undefined') {
        return this.conversation.emailNotifications
      }
      return null
    },
    participants () {
      if (this.conversation.thread && this.conversation.threadMeta) {
        return this.conversation.threadMeta.participants
      }
      return this.conversation.participants
    },
    applicationLink () {
      if (!this.application) return
      if (this.application.user.isCurrentUser) {
        return {
          name: 'groupPreview',
          params: {
            groupPreviewId: this.application.group.id,
          },
        }
      }
      else {
        return {
          name: 'groupApplications',
          params: {
            groupId: this.application.group.id,
          },
        }
      }
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
    applicationInfo () {
      Dialog.create({
        title: this.$t('APPLICATION.WHAT'),
        message: this.$t('APPLICATION.HELP', { groupName: this.application.group.name, userName: this.application.user.displayName }),
        ok: this.$t('BUTTON.BACK'),
      })
    },
    dateInWords (date) {
      return dateFnsHelper.distanceInWordsToNow(date, { addSuffix: true, disallowFuture: true })
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
body.mobile .Detail .q-toolbar
  min-height 20px
  .q-toolbar-title
    font-size 16px
.message-date
    display inline-block
    margin-left 2px
</style>
