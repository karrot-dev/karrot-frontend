<template>
  <div class="wrapper">
    <div class="notices">
      <div v-if="joinedActivities.length > 0">
        <JoinedActivities :activities="joinedActivities" />
      </div>
      <div v-if="hasAvailableActivities">
        <AvailableActivities />
      </div>
      <FeedbackNotice
        v-if="feedbackPossibleCount > 0"
        :feedback-possible-count="feedbackPossibleCount"
      />
    </div>
    <WallConversation :group-id="groupId" />
  </div>
</template>

<script>
import { computed } from 'vue'

import { useActivityListQuery } from '@/activities/queries'
import { useCurrentGroupService } from '@/group/services'
import { useStatusService } from '@/status/services'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'

import AvailableActivities from '@/group/components/AvailableActivities'
import FeedbackNotice from '@/group/components/FeedbackNotice'
import JoinedActivities from '@/group/components/JoinedActivities'
import WallConversation from '@/messages/components/WallConversation'

export default {
  components: {
    JoinedActivities,
    AvailableActivities,
    WallConversation,
    FeedbackNotice,
  },
  setup () {
    const { groupId } = useCurrentGroupService()
    const { getGroupStatus } = useStatusService()

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

    const feedbackPossibleCount = computed(() => getGroupStatus(groupId.value).feedbackPossibleCount)

    return {
      groupId,
      joinedActivities,
      hasAvailableActivities,
      feedbackPossibleCount,
    }
  },
}
</script>

<style scoped lang="sass">
.notices
  margin-top: .5em
  margin-bottom: 3em
</style>
