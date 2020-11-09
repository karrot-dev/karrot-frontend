<template>
  <div class="Detail">
    <KSpinner v-show="isPending" />
    <ChatConversation
      v-if="conversation"
      :conversation="conversationWithMaybeReversedMessages"
      :away="away"
      :current-user="currentUser"
      :start-at-bottom="Boolean(user) || Boolean(activity)"
      :inline="inline"
      compose
      @send="$emit('send', arguments[0])"
      @mark="$emit('mark', arguments[0])"
      @toggle-reaction="$emit('toggle-reaction', arguments[0])"
      @save-message="$emit('save-message', arguments[0])"
      @fetch-past="$emit('fetch-past', arguments[0])"
      @fetch-future="$emit('fetch-future')"
    >
      <template #before-chat-messages>
        <QExpansionItem
          v-if="application"
          default-opened
          class="bg-grey-2"
          :label="$t('APPLICATION.INITIAL')"
          header-class="text-bold"
        >
          <div class="q-pb-sm bg-grey-2">
            <div class="q-ma-sm q-pa-sm bg-white">
              <span class="text-bold text-secondary text-uppercase">{{ application.group.name }}</span>
              <span class="message-date">
                <small class="text-weight-light">
                  <DateAsWords :date="application.createdAt" />
                </small>
              </span>
              <Markdown :source="application.questions" />
            </div>
            <div class="q-ma-sm q-pa-sm bg-white">
              <span class="text-bold text-secondary text-uppercase">{{ application.user.displayName }}</span>
              <span class="message-date">
                <small class="text-weight-light">
                  <DateAsWords :date="application.createdAt" />
                </small>
              </span>
              <Markdown :source="application.answers" />
            </div>
          </div>
        </QExpansionItem>
      </template>
      <template
        v-if="application && application.canDecide"
        #before-chat-compose
      >
        <QBtnGroup
          flat
          spread
          class="bg-grey-2 q-my-sm q-mx-md"
        >
          <QBtn
            flat
            icon="fas fa-fw fa-check"
            color="positive"
            class="q-pa-sm"
            @click="applicationAccept(application)"
          >
            {{ $t('BUTTON.ACCEPT') }}
          </QBtn>
          <QBtn
            flat
            icon="fas fa-fw fa-times"
            color="negative"
            class="q-pa-sm"
            @click="applicationDecline(application)"
          >
            {{ $t('BUTTON.DECLINE') }}
          </QBtn>
        </QBtnGroup>
      </template>
      <template #after-chat-messages>
        <QList
          v-if="activity && activity.isDisabled"
          class="bg-grey-2"
        >
          <QItem>
            <QItemSection>
              <QItemLabel>
                <b class="text-negative">{{ $t('ACTIVITYLIST.ACTIVITY_DISABLED') }}</b>
              </QItemLabel>
            </QItemSection>
          </QItem>
        </QList>
      </template>
    </ChatConversation>
  </div>
</template>

<script>
import ChatConversation from '@/messages/components/ChatConversation'
import Markdown from '@/utils/components/Markdown'
import DateAsWords from '@/utils/components/DateAsWords'
import KSpinner from '@/utils/components/KSpinner'

import {
  QExpansionItem,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QBtn,
  QBtnGroup,
  Dialog,
} from 'quasar'

export default {
  components: {
    ChatConversation,
    Markdown,
    DateAsWords,
    KSpinner,
    QExpansionItem,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QBtn,
    QBtnGroup,
  },
  props: {
    inline: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: null,
    },
    activity: {
      type: Object,
      default: null,
    },
    application: {
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
    currentUser: {
      type: Object,
      default: null,
    },
  },
  computed: {
    isPending () {
      if (!this.conversation) return false
      return this.conversation.fetchStatus.pending
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
  },
  methods: {
    applicationAccept (application) {
      Dialog.create({
        title: this.$t('APPLICATION.ACCEPT_CONFIRMATION_HEADER'),
        message: this.$t('APPLICATION.ACCEPT_CONFIRMATION_TEXT', { userName: application.user.displayName }),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .onOk(() => this.$emit('application-accept', application.id))
    },
    applicationDecline (application) {
      Dialog.create({
        title: this.$t('APPLICATION.DECLINE_CONFIRMATION_HEADER'),
        message: this.$t('APPLICATION.DECLINE_CONFIRMATION_TEXT', { userName: application.user.displayName }),
        ok: this.$t('BUTTON.YES'),
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .onOk(() => this.$emit('application-decline', application.id))
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

.Detail
  background-color white

.message-date
  display inline-block
  margin-left 2px
</style>
