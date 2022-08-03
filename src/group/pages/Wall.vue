<template>
  <div class="wrapper">
    <div class="notices">
      <KSpinner v-show="isLoadingJoinedActivities" />
      <div v-if="joinedActivities.length > 0">
        <JoinedActivities
          :activities="joinedActivities"
          @detail="detail"
        />
      </div>
      <div v-if="hasAvailableActivities">
        <AvailableActivities />
      </div>
      <FeedbackNotice
        v-if="feedbackPossibleCount > 0"
        :feedback-possible-count="feedbackPossibleCount"
      />
    </div>
    <WallConversation
      :conversation="conversation"
      :messages="messages"
      :pending="isLoadingConversation || isLoadingMessages"
      :user="user"
      :can-fetch-past="hasNextPage"
      :fetch-past="() => fetchNextPage()"
      :past-pending="isFetchingNextPage"
      :send-status="sendStatus"
      @send="send"
      @save-message="saveMessage"
      @mark-all-read="markAllRead"
      @save-conversation="saveConversation"
      @toggle-reaction="toggleReaction"
      @open-thread="openThread"
    />
  </div>
</template>

<script>
import { computed } from 'vue'

import AvailableActivities from '@/group/components/AvailableActivities'
import FeedbackNotice from '@/group/components/FeedbackNotice'
import JoinedActivities from '@/group/components/JoinedActivities'
import WallConversation from '@/messages/components/WallConversation'
import KSpinner from '@/utils/components/KSpinner'

import { mapActions } from 'vuex'
import { useAuthService } from '@/authuser/services'
import { useCurrentGroupService } from '@/group/services'
import { useActivityListQuery } from '@/activities/queries'
import { useActivityEnricher } from '@/activities/enrichers'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'
import { useStatusService } from '@/status/services'
import { useConversationQuery, useMessageListQuery } from '@/messages/queries'
import { useConversationEnricher, useMessageEnricher } from '@/messages/enrichers'
import { useSendMessageMutation } from '@/messages/mutations'

export default {
  components: {
    JoinedActivities,
    AvailableActivities,
    WallConversation,
    FeedbackNotice,
    KSpinner,
  },
  setup () {
    const { groupId } = useCurrentGroupService()
    const { user } = useAuthService()
    const enrichActivity = useActivityEnricher()
    const { getGroupStatus } = useStatusService()

    const {
      activities: joinedActivities,
      isLoading: isLoadingJoinedActivities,
    } = useActivityListQuery({
      groupId,
      dateMin: newDateRoundedTo5Minutes(),
      slots: 'joined',
      pageSize: 50,
    })

    const {
      activities: availableActivities,
    } = useActivityListQuery({
      groupId,
      dateMin: newDateRoundedTo5Minutes(),
      slots: 'free',
      places: 'subscribed',
      pageSize: 1,
    })

    const hasAvailableActivities = computed(() => availableActivities.value.length > 0)

    const feedbackPossibleCount = computed(() => getGroupStatus(groupId.value).feedbackPossibleCount)

    const enrichConversation = useConversationEnricher()
    const enrichMessage = useMessageEnricher()
    const {
      conversation,
      isLoading: isLoadingConversation,
    } = useConversationQuery({ groupId })
    const conversationId = computed(() => conversation.value?.id)
    const {
      messages,
      isLoading: isLoadingMessages,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage, // TODO: this is not being passed into component yet...
    } = useMessageListQuery({ conversationId })

    const {
      mutate: send,
      status: sendStatus,
    } = useSendMessageMutation()

    // const data = computed(() => ({
    //   ...enrichConversation(conversation.value),
    //   messages: messages.value.map(enrichMessage),
    // }))

    return {
      user,
      joinedActivities: computed(() => joinedActivities.value.map(enrichActivity)),
      isLoadingJoinedActivities,
      hasAvailableActivities,
      feedbackPossibleCount,

      conversation: computed(() => enrichConversation(conversation.value)),
      isLoadingConversation,

      messages: computed(() => messages.value.map(enrichMessage)),
      isLoadingMessages,
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,

      send,
      sendStatus,
    }
  },
  methods: {
    ...mapActions({
      detail: 'detail/openForActivity',
      openThread: 'detail/openForThread',
      saveMessage: 'conversations/saveMessage',
      markAllRead: 'conversations/markAllRead',
      saveConversation: 'conversations/maybeSave',
      toggleReaction: 'conversations/toggleReaction',
    }),
  },
}
</script>

<style scoped lang="sass">
.notices
  margin-top: .5em
  margin-bottom: 3em
</style>
