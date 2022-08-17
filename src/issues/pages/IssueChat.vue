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
      <div class="q-mx-sm q-mb-sm q-pa-sm">
        <span class="text-bold text-primary">
          {{ $t('CONFLICT.WITH', { userName: affectedUser.displayName }) }}
        </span>
        <ProfilePicture
          :user="affectedUser"
          :size="25"
          class="q-mt-xs"
        />
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
    </QExpansionItem>
    <div
      v-if="conversation"
      class="bg-secondary absolute-top-right q-pa-xs"
    >
      <NotificationToggle
        :muted="isMuted"
        :is-participant="isParticipant"
        :can-unsubscribe="false"
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
      :away="away"
      :current-user="currentUser"
      :has-next-page="hasNextPage"
      :is-fetching-next-page="isFetchingNextPage"
      :fetch-next-page="fetchNextPage"
    />
  </div>
</template>

<script>
import { computed } from 'vue'
import { mapGetters } from 'vuex'

import {
  QExpansionItem,
  QItemSection,
  QBtn,
} from 'quasar'

import ChatConversation from '@/messages/components/ChatConversation'
import Markdown from '@/utils/components/Markdown'
import DateAsWords from '@/utils/components/DateAsWords'
import ProfilePicture from '@/users/components/ProfilePicture'
import NotificationToggle from '@/messages/components/NotificationToggle'

import { useActiveIssueService } from '@/issues/services'
import { useUserService } from '@/users/services'
import { useAuthService } from '@/authuser/services'
import { useSaveConversationMutation } from '@/messages/mutations'
import { useConversationHelpers } from '@/messages/helpers'

export default {
  components: {
    ChatConversation,
    Markdown,
    DateAsWords,
    ProfilePicture,
    NotificationToggle,
    QExpansionItem,
    QItemSection,
    QBtn,
  },
  setup () {
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

    return {
      currentUser,
      issue,
      affectedUser,
      createdBy,
      isParticipant,
      isMuted,
      participants,
      conversation,
      messages,
      hasNextPage,
      isFetchingNextPage,
      fetchNextPage,
      saveConversation,
    }
  },
  computed: {
    ...mapGetters({
      // issue: 'issues/current',
      // conversation: 'issues/currentConversation',
      away: 'presence/toggle/away',
      // currentUser: 'auth/user',
    }),
    // conversationWithReversedMessages () {
    //   return {
    //     ...this.conversation,
    //     messages: this.conversation.messages.slice().reverse(),
    //   }
    // },
  },
  methods: {
    setNotifications (value) {
      this.saveConversation({
        id: this.conversation.id,
        value,
      })
    },
  },

}
</script>
