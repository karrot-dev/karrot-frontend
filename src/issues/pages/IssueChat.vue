<template>
  <div v-if="issue">
    <QCollapsible
      opened
      class="bg-grey-2"
    >
      <template slot="header">
        <b>{{ $t('CONFLICT.INITIAL') }}</b>
      </template>
      <div class="q-ma-sm q-pa-sm bg-white">
        <span class="text-bold text-primary">
          {{ $t('CONFLICT.WITH', { userName: issue.affectedUser.displayName }) }}
        </span>
        <ProfilePicture
          :user="issue.affectedUser"
          :size="25"
          :is-link="true"
          class="q-mt-sm"
        />
      </div>
      <div class="q-ma-sm q-pa-sm bg-white">
        <span class="text-bold text-secondary uppercase">
          <RouterLink
            place="userName"
            @click.native.stop
            :to="{name: 'user', params: { userId: issue.createdBy.id }}"
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
    </QCollapsible>
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

import { mapGetters, mapActions } from 'vuex'

import {
  QCollapsible,
} from 'quasar'

export default {
  components: {
    ChatConversation,
    Markdown,
    DateAsWords,
    QCollapsible,
    ProfilePicture,
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
    }),
  },

}
</script>
