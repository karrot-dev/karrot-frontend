<template>
  <QLayout>
    <QLayoutHeader>
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
              <span class="text-bold text-secondary uppercase">{{ conflict.createdBy.displayName }}</span>
              <span class="message-date">
                <small class="text-weight-light">
                  <DateAsWords :date="conflict.createdAt" />
                </small>
              </span>
              <Markdown :source="conflict.topic" />
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
          <ConflictVote
            :conflict="conflict"
          />
        </QTabPane>
      </QTabs>
    </QLayoutHeader>
  </QLayout>
</template>

<script>
import ConflictVote from '@/votes/components/ConflictVote'
import ChatConversation from '@/messages/components/ChatConversation'
import Markdown from '@/utils/components/Markdown'
import DateAsWords from '@/utils/components/DateAsWords'

import {
  QLayout,
  QLayoutHeader,
  QTabs,
  QTab,
  QTabPane,
  QCollapsible,
} from 'quasar'

export default {
  components: {
    ChatConversation,
    ConflictVote,
    QLayout,
    QLayoutHeader,
    QTabs,
    QTab,
    QTabPane,
    QCollapsible,
    Markdown,
    DateAsWords,
  },
  props: {
    conflict: {
      type: Object,
      default: null,
    },
    value: {
      type: Number,
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
    history: {
      type: Array,
      default: null,
    },
  },
}
</script>
