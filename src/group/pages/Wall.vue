<template>
  <div class="wrapper">
    <div class="notices">
      <KSpinner v-show="fetchingActivities || feedbackPossibleStatus.pending" />
      <div v-if="joinedActivities.length > 0">
        <JoinedActivities
          :activities="joinedActivities"
          @join="join"
          @leave="leave"
          @detail="detail"
        />
      </div>
      <div v-if="hasAvailableActivities">
        <AvailableActivities />
      </div>
      <FeedbackNotice
        v-if="feedbackPossible.length > 0"
        :feedback-possible="feedbackPossible"
      />
    </div>
    <WallConversation
      :data="conversation"
      :user="user"
      :fetch-past="fetchPast"
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

import { mapGetters, mapActions } from 'vuex'
import { useAuthService } from '@/authuser/services'
import { useCurrentGroupService } from '@/group/services'
import { useActivityListQuery } from '@/activities/queries'
import { useActivityEnricher } from '@/activities/enrichers'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'

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

    const {
      activities: joinedActivities,
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

    return {
      user,
      joinedActivities: computed(() => joinedActivities.value.map(enrichActivity)),
      hasAvailableActivities,
    }
  },
  computed: {
    ...mapGetters({
      // joinedActivities: 'activities/joined',
      // availableActivities: 'activities/available',
      fetchingActivities: 'activities/fetchingForCurrentGroup',
      feedbackPossible: 'activities/feedbackPossibleByCurrentGroup',
      feedbackPossibleStatus: 'activities/fetchFeedbackPossibleStatus',
      conversation: 'currentGroup/conversation',
    }),
  },
  methods: {
    ...mapActions({
      join: 'activities/join',
      leave: 'activities/leave',
      detail: 'detail/openForActivity',
      openThread: 'detail/openForThread',
      send: 'conversations/send',
      saveMessage: 'conversations/saveMessage',
      markAllRead: 'conversations/markAllRead',
      saveConversation: 'conversations/maybeSave',
      toggleReaction: 'conversations/toggleReaction',
      fetchPast: 'conversations/fetchPast',
    }),
  },
}
</script>

<style scoped lang="sass">
.notices
  margin-top: .5em
  margin-bottom: 3em
</style>
