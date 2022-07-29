<template>
  <div>
    <KNotice v-if="isInactive">
      <template #icon>
        <QIcon class="far fa-handshake" />
      </template>
      {{ $t('STOREDETAIL.INACTIVE') }}
      <template #desc>
        <RouterLink
          v-if="isEditor"
          :to="{name: 'placeEdit', params: { placeId }}"
        >
          {{ $t('STOREDETAIL.CHANGE_STATUS') }}
        </RouterLink>
      </template>
    </KNotice>
    <KNotice v-else-if="hasNoActivities">
      <template #icon>
        <QIcon class="fas fa-bed" />
      </template>
      {{ $t('ACTIVITYLIST.NONE') }}
      <template #desc>
        <RouterLink
          v-if="isEditor"
          :to="{name: 'placeActivitiesManage', params: { placeId }}"
        >
          {{ $t('ACTIVITYLIST.STORE_NONE_HINT') }}
        </RouterLink>
      </template>
    </KNotice>
    <ActivityList
      :pending="isLoading"
      :activities="activities"
      @detail="detail"
    />
  </div>
</template>

<script>
import { QIcon } from 'quasar'
import { mapActions } from 'vuex'
import { computed } from 'vue'

import ActivityList from '@/activities/components/ActivityList'
import KNotice from '@/utils/components/KNotice'

import { useCurrentGroupService } from '@/group/services'
import { useActivityListQuery } from '@/activities/queries'
import { useActivePlaceService } from '@/places/services'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'
import { useActivityService } from '@/activities/services'
import { useActivityEnricher } from '@/activities/enrichers'
import { useAuthService } from '@/authuser/services'

export default {
  components: {
    ActivityList,
    KNotice,
    QIcon,
  },
  setup () {
    const { id: userId } = useAuthService()
    const { groupId, getIsEditor } = useCurrentGroupService()
    const { place, placeId } = useActivePlaceService()
    const { isStartedOrUpcoming } = useActivityService()
    const enrichActivity = useActivityEnricher()
    const {
      activities,
      isLoading,
    } = useActivityListQuery({
      groupId,
      placeId,
      dateMin: newDateRoundedTo5Minutes(),
    })

    const enrichedUpcomingActivities = computed(() => activities.value.filter(isStartedOrUpcoming).map(enrichActivity))

    return {
      userId,
      isLoading,
      placeId,
      place,
      isEditor: computed(() => getIsEditor(userId.value)),
      activities: enrichedUpcomingActivities,
    }
  },
  computed: {
    hasNoActivities () {
      if (this.isLoading) return false
      return this.activities && this.activities.length === 0
    },
    isInactive () {
      return this.place?.status !== 'active'
    },
  },
  methods: {
    ...mapActions({
      detail: 'detail/openForActivity',
    }),
  },
}
</script>
