<template>
  <div>
    <QTabs
      animated
      align="justify"
    >
      <QTab
        default
        slot="title"
        name="chat"
        icon="fas fa-comments"
      />
      <QTab
        slot="title"
        name="vote"
        icon="fas fa-vote-yea"
      />

      <QTabPane name="chat">
        <QCollapsible
          opened
          class="bg-grey-2"
        >
          <template slot="header">
            <b>{{ $t('CONFLICT.INITIAL') }}</b>
          </template>
          <div class="q-ma-sm q-pa-sm bg-white">
            <span class="text-bold text-primary">
              {{ $t('CONFLICT.WITH') }}
            </span>
            <div>
              <ProfilePicture
                :user="issue.affectedUser"
                :size="25"
                :is-link="true"
                class="q-mt-sm"
              />
              {{ issue.affectedUser.displayName }}
            </div>
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
          :inline="inline"
          @send="$emit('send', arguments[0])"
          @mark="$emit('mark', arguments[0])"
          @toggleReaction="$emit('toggleReaction', arguments[0])"
          @saveMessage="$emit('saveMessage', arguments[0])"
          @fetchPast="$emit('fetchPast', arguments[0])"
          @fetchFuture="$emit('fetchFuture')"
        />
      </QTabPane>
      <QTabPane name="vote">
        <QCard
          v-if="issue.status === 'ongoing'"
        >
          <IssueVote
            :issue="issue"
            @saveScores="$emit('saveScores', arguments[0])"
          />
          <QList
            v-if="multipleVotings"
          >
            <IssueHistoryItem
              v-for="v in allPastVotings"
              :key="v.id"
              :voting="v"
            />
          </QList>
        </QCard>

        <QCard
          v-if="issue.status !== 'ongoing'"
        >
          <QCardTitle>
            {{ $t('ISSUE.VOTING.RESULTS.TIME_UP') }}
          </QCardTitle>
          <QCardMain>
            <VotingResults
              :voting="newestVoting"
              :affected-user="issue.affectedUser"
              :group-name="issue.group.name"
              :issue-status="issue.status"
            />
            <QList
              v-if="multipleVotings"
            >
              <IssueHistoryItem
                v-for="v in olderVotings"
                :key="v.id"
                :voting="v"
                :affected-user="issue.affectedUser"
                :group-name="issue.group.name"
                :issue-status="issue.status"
              />
            </QList>
          </QCardMain>
        </QCard>
      </QTabPane>
    </QTabs>
  </div>
</template>

<script>
import IssueVote from '@/issues/components/IssueVote'
import VotingResults from '@/issues/components/VotingResults'
import IssueHistoryItem from '@/issues/components/IssueHistoryItem'
import ChatConversation from '@/messages/components/ChatConversation'
import Markdown from '@/utils/components/Markdown'
import DateAsWords from '@/utils/components/DateAsWords'
import ProfilePicture from '@/users/components/ProfilePicture'
import reactiveNow from '@/utils/reactiveNow'

import {
  QTabs,
  QTab,
  QTabPane,
  QCollapsible,
  QList,
  QCard,
  QCardMain,
  QCardTitle,
} from 'quasar'

export default {
  components: {
    ChatConversation,
    IssueVote,
    VotingResults,
    IssueHistoryItem,
    QTabs,
    QTab,
    QTabPane,
    QCollapsible,
    Markdown,
    DateAsWords,
    QList,
    QCard,
    QCardMain,
    QCardTitle,
    ProfilePicture,
  },
  props: {
    issue: {
      type: Object,
      default: null,
    },
    conversation: {
      type: Object,
      default: null,
    },
    away: {
      type: Boolean,
      default: false,
    },
    inline: {
      type: Boolean,
      default: false,
    },
    currentUser: {
      type: Object,
      default: null,
    },
  },
  computed: {
    conversationWithReversedMessages () {
      return {
        ...this.conversation,
        messages: this.conversation.messages.slice().reverse(),
      }
    },
    newestVoting () {
      const tempArray = this.issue.votings.slice().sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt))
      return tempArray[0]
    },
    multipleVotings () {
      return this.issue.votings.length > 1
    },
    allPastVotings () {
      return this.issue.votings.filter(v => v.expiresAt <= reactiveNow.value)
    },
    olderVotings () {
      return this.allPastVotings.filter(v => v.id !== this.newestVoting.id)
    },
  },
}
</script>
