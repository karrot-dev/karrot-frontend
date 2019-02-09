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
            <span class="text-bold text-secondary uppercase">{{ issue.createdBy.displayName }}</span>
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
          :conversation="conversation"
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
        <IssueVote
          v-if="issue.status === 'ongoing'"
          :issue="issue"
          @saveScores="$emit('saveScores', arguments[0])"
        />
        <IssueResults
          v-if="issue.status !== 'ongoing'"
          :issue="issue"
        />
        <QList
          v-if="!issue.votings[0]"
        >
          <IssueHistoryItem
            v-for="v in issue.votings"
            :key="v.id"
            :issue="issue"
          />
        </QList>
      </QTabPane>
    </QTabs>
  </div>
</template>

<script>
import IssueVote from '@/issues/components/IssueVote'
import IssueResults from '@/issues/components/IssueResults'
import IssueHistoryItem from '@/issues/components/IssueHistoryItem'
import ChatConversation from '@/messages/components/ChatConversation'
import Markdown from '@/utils/components/Markdown'
import DateAsWords from '@/utils/components/DateAsWords'

import {
  QTabs,
  QTab,
  QTabPane,
  QCollapsible,
  QList,
} from 'quasar'

export default {
  components: {
    ChatConversation,
    IssueVote,
    IssueResults,
    IssueHistoryItem,
    QTabs,
    QTab,
    QTabPane,
    QCollapsible,
    Markdown,
    DateAsWords,
    QList,
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
}
</script>
