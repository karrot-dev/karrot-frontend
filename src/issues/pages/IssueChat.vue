<template>
  <div
    v-if="issue"
    class="relative-position"
  >
    <QExpansionItem
      default-opened
      switch-toggle-side
      class="bg-grey-2"
    >
      <template #header>
        <QItemSection>
          <b>{{ $t('CONFLICT.INITIAL') }}</b>
        </QItemSection>
      </template>
      <div class="q-mx-sm q-mb-sm q-pa-sm row">
        <ProfilePicture
          :user="affectedUser"
          :size="40"
          class="q-mr-sm col-auto"
        />
        <span class="text-bold col">
          {{ $t('CONFLICT.WITH', { userName: affectedUser.displayName }) }}
        </span>
      </div>
      <div
        v-if="issue.status !== 'ongoing'"
        class="q-mx-sm q-mb-sm q-pl-sm text-warning"
      >
        <i class="fas fa-info-circle q-mr-xs" />
        {{ $t('ISSUE.VOTING.RESULTS.TIME_UP') }}
        <QBtn
          :to="{ name: 'issueVote', params: { groupId: issue.group, issueId: issue.id } }"
          flat
        >
          {{ $t('ISSUE.VOTING.SEE_RESULTS') }}
        </QBtn>
      </div>
      <div class="q-mx-sm q-mb-sm q-pa-sm bg-white">
        <span class="text-bold text-secondary text-uppercase">
          <RouterLink
            :to="{name: 'user', params: { userId: issue.createdBy }}"
            @click.stop
          >
            {{ createdBy.displayName }}
          </RouterLink>
        </span>
        <span class="message-date">
          <small class="text-weight-light">
            <DateAsWords
              :date="issue.createdAt"
              :future="false"
            />
          </small>
        </span>
        <Markdown :source="issue.topic" />
      </div>
      <div
        v-if="conversation && isParticipant"
        class="q-ml-sm q-pt-sm q-pl-sm"
      >
        <div class="row">
          <ProfilePicture
            v-for="user in participants"
            :key="user.id"
            :user="user"
            :size="20"
            class="q-mr-xs"
          />
        </div>
        <div class="text-caption k-caption-opacity q-mt-xs">
          {{ $t('ISSUE.PARTICIPANTS', { count: participants.length }) }}
        </div>
      </div>
      <hr class="text-grey-1">
    </QExpansionItem>
    <div
      v-if="conversation"
      class="bg-secondary absolute-top-right q-pa-xs"
    >
      <NotificationToggle
        :muted="isMuted"
        :is-participant="isParticipant"
        :user="currentUser"
        in-toolbar
        :size="$q.platform.is.mobile ? 'sm' : 'md'"
        @set="setNotifications"
      />
    </div>
    <ChatConversation
      v-if="conversation"
      :conversation="conversation"
      :messages="messages"
      :away="isAway"
      :current-user="currentUser"
      :has-next-page="hasNextPage"
      :is-fetching-next-page="isFetchingNextPage"
      :fetch-next-page="fetchNextPage"
    />
  </div>
</template>

<script setup>
import {
  QExpansionItem,
  QItemSection,
  QBtn,
} from 'quasar'
import { computed } from 'vue'

import { useAuthService } from '@/authuser/services'
import { usePresenceService } from '@/base/services/presence'
import { useActiveIssueService } from '@/issues/services'
import { useConversationHelpers } from '@/messages/helpers'
import { useSaveConversationMutation } from '@/messages/mutations'
import { useUserService } from '@/users/services'

import ChatConversation from '@/messages/components/ChatConversation.vue'
import NotificationToggle from '@/messages/components/NotificationToggle.vue'
import ProfilePicture from '@/users/components/ProfilePicture.vue'
import DateAsWords from '@/utils/components/DateAsWords.vue'
import Markdown from '@/utils/components/Markdown.vue'

const {
  issue,
  conversation,
  messages,
  hasNextPage,
  isFetchingNextPage,
  fetchNextPage,
} = useActiveIssueService()

const {
  user: currentUser,
} = useAuthService()

const {
  getUserById,
} = useUserService()

const {
  getIsMuted,
  getIsParticipant,
} = useConversationHelpers()

const affectedUser = computed(() => getUserById(issue.value.affectedUser))
const createdBy = computed(() => getUserById(issue.value.createdBy))
const participants = computed(() => conversation.value.participants.map(getUserById))
const isMuted = computed(() => getIsMuted(conversation.value))
const isParticipant = computed(() => getIsParticipant(conversation.value))

const { mutate: saveConversation } = useSaveConversationMutation()

const { isAway } = usePresenceService()

function setNotifications (value) {
  saveConversation({
    id: conversation.value.id,
    value,
  })
}
</script>
