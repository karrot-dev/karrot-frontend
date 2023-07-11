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
    <QInfiniteScroll
      v-else
      :disable="!hasNextPage"
      :offset="100"
      @load="maybeFetchMore"
    >
      <ActivityList
        :pending="isLoading"
        :activities="activities"
      />
      <KSpinner v-show="isLoading || isFetchingNextPage" />
    </QInfiniteScroll>
  </div>
</template>

<script>
import { QIcon, QInfiniteScroll } from 'quasar'
import { computed } from 'vue'

import { useActivityHelpers } from '@/activities/helpers'
import { useActivityListQuery } from '@/activities/queries'
import { useAuthService } from '@/authuser/services'
import { useCurrentGroupService } from '@/group/services'
import { useActivePlaceService } from '@/places/services'
import { newDateRoundedTo5Minutes } from '@/utils/queryHelpers'

import ActivityList from '@/activities/components/ActivityList.vue'
import KNotice from '@/utils/components/KNotice.vue'
import KSpinner from '@/utils/components/KSpinner.vue'

export default {
  components: {
    ActivityList,
    KNotice,
    KSpinner,
    QIcon,
    QInfiniteScroll,
  },
  setup () {
    const { userId } = useAuthService()
    const { groupId, isEditor } = useCurrentGroupService()
    const { place, placeId } = useActivePlaceService()
    const { getIsStartedOrUpcoming } = useActivityHelpers()
    const {
      activities: activitiesRaw,
      isLoading,
      isFetching,
      isFetchingNextPage,
      hasNextPage,
      fetchNextPage,
    } = useActivityListQuery({
      groupId,
      placeId,
      dateMin: newDateRoundedTo5Minutes(),
    })

    async function maybeFetchMore (index, done) {
      if (!isFetching.value && hasNextPage.value) await fetchNextPage()
      done(!hasNextPage.value)
    }

    const activities = computed(() => activitiesRaw.value.filter(getIsStartedOrUpcoming))

    return {
      userId,
      isLoading,
      isFetchingNextPage,
      hasNextPage,
      maybeFetchMore,
      placeId,
      place,
      isEditor,
      activities,
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
}
</script>
