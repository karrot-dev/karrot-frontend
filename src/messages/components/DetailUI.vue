<template>
  <div class="Detail">
    <KSpinner v-show="pending" />
    <ChatConversation
      v-if="conversation && !pending"
      :conversation="conversation"
      :messages="maybeReversedMessages"
      :away="away"
      :pending="pending"
      :order="order"
      :inline="inline"
      :has-next-page="hasNextPage"
      :is-fetching-next-page="isFetchingNextPage"
      :fetch-next-page="fetchNextPage"
      compose
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
        v-if="application && canDecideApplication"
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
            @click="applicationAcceptDialog(application)"
          >
            {{ $t('BUTTON.ACCEPT') }}
          </QBtn>
          <QBtn
            flat
            icon="fas fa-fw fa-times"
            color="negative"
            class="q-pa-sm"
            @click="applicationDeclineDialog(application)"
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
import { useAcceptApplicationMutation, useDeclineApplicationMutation } from '@/applications/mutations'
import { showToast } from '@/utils/toasts'
import { useQueryClient } from 'vue-query'
import { computed } from 'vue'
import { useCurrentGroupService } from '@/group/services'
import { useDetailService } from '../services'
import { useI18n } from 'vue-i18n'

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
    messages: {
      type: Array,
      default: null,
    },
    order: {
      type: String,
      default: null,
    },
    pending: {
      type: Boolean,
      default: false,
    },
    away: {
      type: Boolean,
      default: false,
    },
    hasNextPage: {
      type: Boolean,
      default: false,
    },
    isFetchingNextPage: {
      type: Boolean,
      default: false,
    },
    fetchNextPage: {
      type: Function,
      default: () => {},
    },
  },
  emits: [
    'mark',
    'fetch-next',
  ],
  setup () {
    const {
      mutate: acceptApplication,
    } = useAcceptApplicationMutation()
    const {
      mutate: declineApplication,
    } = useDeclineApplicationMutation()
    const queryClient = useQueryClient()
    const { t } = useI18n()

    const { groupId: currentGroupId, isEditor } = useCurrentGroupService()
    const { application } = useDetailService()
    const canDecideApplication = computed(() => application.value.status === 'pending' && application.value.group === currentGroupId.value && isEditor)

    function applicationAcceptDialog (application) {
      Dialog.create({
        title: t('APPLICATION.ACCEPT_CONFIRMATION_HEADER'),
        message: t('APPLICATION.ACCEPT_CONFIRMATION_TEXT', { userName: application.user.displayName }),
        ok: t('BUTTON.YES'),
        cancel: t('BUTTON.CANCEL'),
      })
        .onOk(() => acceptApplication(application.id, {
          onSuccess () {
            showToast({
              message: 'APPLICATION.ACCEPTED',
              messageParams: { userName: application.user.displayName },
            })
            queryClient.invalidateQueries(['applications'])
          },
        }))
    }
    function applicationDeclineDialog (application) {
      Dialog.create({
        title: t('APPLICATION.DECLINE_CONFIRMATION_HEADER'),
        message: t('APPLICATION.DECLINE_CONFIRMATION_TEXT', { userName: application.user.displayName }),
        ok: t('BUTTON.YES'),
        cancel: t('BUTTON.CANCEL'),
      })
        .onOk(() => declineApplication(application.id, {
          onSuccess () {
            showToast({
              message: 'APPLICATION.DECLINED',
              messageParams: { userName: application.user.displayName },
            })
            queryClient.invalidateQueries(['applications'])
          },
        }))
    }

    return {
      applicationAcceptDialog,
      applicationDeclineDialog,
      canDecideApplication,
      queryClient,
    }
  },
  computed: {
    maybeReversedMessages () {
      if (!this.conversation || !this.messages) return
      return this.order === 'oldest-first' ? this.messages : this.messages.slice().reverse()
    },
  },
}
</script>

<style scoped lang="sass">
.Detail
  background-color: white

.message-date
  display: inline-block
  margin-left: 2px
</style>
