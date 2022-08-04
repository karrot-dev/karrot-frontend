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
      :group-id="groupId"
      :user="user"
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

    return {
      groupId,
      user,
      joinedActivities: computed(() => joinedActivities.value.map(enrichActivity)),
      isLoadingJoinedActivities,
      hasAvailableActivities,
      feedbackPossibleCount,
    }
  },
  methods: {
    ...mapActions({
      detail: 'detail/openForActivity',
      openThread: 'detail/openForThread',
    }),
  },
}
</script>

<style scoped lang="sass">
.notices
  margin-top: .5em
  margin-bottom: 3em
</style>
