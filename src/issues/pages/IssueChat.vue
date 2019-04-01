<template>
  <div
    v-if="issue"
    class="relative-position"
  >
    <QCollapsible
      opened
      class="bg-grey-2"
    >
      <template slot="header">
        <b>{{ $t('CONFLICT.INITIAL') }}</b>
      </template>
      <div class="q-mx-sm q-mb-sm q-pa-sm">
        <span class="text-bold text-primary">
          {{ $t('CONFLICT.WITH', { userName: issue.affectedUser.displayName }) }}
        </span>
        <ProfilePicture
          :user="issue.affectedUser"
          :size="25"
          class="q-mt-xs"
        />
      </div>
      <div
        v-if="!issue.isOngoing"
        class="q-mx-sm q-mb-sm q-pl-sm text-warning"
      >
        <i class="fas fa-info-circle q-mr-xs" />
        {{ $t('ISSUE.VOTING.RESULTS.TIME_UP') }}
        <QBtn
          :to="{ name: 'issueVote', params: { groupId: issue.group.id, issueId: issue.id } }"
          flat
        >
          {{ $t('ISSUE.VOTING.SEE_RESULTS') }}
        </QBtn>
      </div>
      <div class="q-mx-sm q-mb-sm q-pa-sm bg-white">
        <span class="text-bold text-secondary uppercase">
          <RouterLink
            place="userName"
            :to="{name: 'user', params: { userId: issue.createdBy.id }}"
            @click.native.stop
          >
            {{ issue.createdBy.displayName }}
          </RouterLink>
        </span>
        <span class="message-date">
          <small class="text-weight-light">
            <DateAsWords :date="issue.createdAt" />
          </small>
        </span>
        <Markdown :source="issue.topic" />
      </div>
      <div
        v-if="conversation"
        class="q-ml-sm q-pt-sm q-pl-sm"
      >
        <div>
          <ProfilePicture
            v-for="user in conversation.participants"
            :key="user.id"
            :user="user"
            :size="20"
            class="q-mr-xs"
          />
        </div>
        <div class="q-caption q-caption-opacity q-mt-xs">
          {{ $t('ISSUE.PARTICIPANTS', { count: conversation.participants.length }) }}
        </div>
      </div>
    </QCollapsible>
    <div
      v-if="conversation"
      class="bg-secondary absolute-top-right round-borders q-pa-xs"
    >
      <NotificationToggle
        :muted="conversation.muted"
        :is-participant="conversation.isParticipant"
        :can-unsubscribe="false"
        :user="currentUser"
        in-toolbar
        :size="$q.platform.is.mobile ? 'sm' : 'md'"
        @set="setNotifications"
      />
    </div>
    <ChatConversation
      v-if="conversation"
      :conversation="conversationWithReversedMessages"
      :away="away"
      :current-user="currentUser"
      :start-at-bottom="true"
      @mark="mark"
      @toggleReaction="toggleReaction"
      @saveMessage="saveMessage"
      @fetchPast="fetchPast"
    />
  </div>
</template>

<script>
import ChatConversation from '@/messages/components/ChatConversation'
import Markdown from '@/utils/components/Markdown'
import DateAsWords from '@/utils/components/DateAsWords'
import ProfilePicture from '@/users/components/ProfilePicture'
import NotificationToggle from '@/messages/components/NotificationToggle'

import { mapGetters, mapActions } from 'vuex'

import {
  QCollapsible,
  QBtn,
} from 'quasar'

export default {
  components: {
    ChatConversation,
    Markdown,
    DateAsWords,
    ProfilePicture,
    NotificationToggle,
    QCollapsible,
    QBtn,
  },
  computed: {
    ...mapGetters({
      issue: 'issues/current',
      conversation: 'issues/currentConversation',
      away: 'presence/toggle/away',
      currentUser: 'auth/user',
    }),
    conversationWithReversedMessages () {
      return {
        ...this.conversation,
        messages: this.conversation.messages.slice().reverse(),
      }
    },
  },
  methods: {
    ...mapActions({
      saveMessage: 'conversations/saveMessage',
      mark: 'conversations/maybeMark',
      setMuted: 'conversations/maybeSetMuted',
      toggleReaction: 'conversations/toggleReaction',
      fetchPast: 'conversations/fetchPast',
      saveConversation: 'conversations/maybeSave',
    }),
    setNotifications (value) {
      this.saveConversation({
        conversationId: this.conversation.id,
        value,
      })
    },
  },

}
</script>
