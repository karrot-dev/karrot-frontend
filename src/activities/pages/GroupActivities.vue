<template>
  <div>
    <QInfiniteScroll
      :disable="!hasNextPage"
      :offset="100"
      @load="maybeFetchMore"
    >
      <ActivityList
        :activities="activities"
        :pending="isLoading"
        place-link
        filter
        :filter-activity-types="activityTypes"
        :ics-url="''"
        :token-pending="false"
        @detail="detail"
      />
    </QInfiniteScroll>
    <template v-if="hasNoActivities">
      <KNotice>
        <template #icon>
          <QIcon class="fas fa-bed" />
        </template>
        {{ $t('ACTIVITYLIST.NONE') }}
        <template #desc>
          {{ $t('ACTIVITYLIST.NONE_HINT') }}
        </template>
      </KNotice>
      <QCard>
        <QCardSection>
          <span v-t="'GROUP.PLACES'" />
        </QCardSection>
        <QCardSection>
          <PlaceList
            :group-id="groupId"
            :places="places"
            link-to="placeActivitiesManage"
          />
        </QCardSection>
      </QCard>
    </template>
  </div>
</template>

<script>
import { computed, onUnmounted } from 'vue'
import {
  QCard,
  QIcon,
  QCardSection,
  QInfiniteScroll,
} from 'quasar'

import { mapGetters, mapActions } from 'vuex'

import ActivityList from '@/activities/components/ActivityList'
import KNotice from '@/utils/components/KNotice'
import PlaceList from '@/places/components/PlaceList'
import { useActivityListQuery } from '@/activities/queries'
import reactiveNow from '@/utils/reactiveNow'
import { useActivityEnricher, useActivityTypeEnricher } from '@/activities/enrichers'
import { useActivityService } from '@/activities/services'
import { useCurrentGroupService } from '@/group/services'
import { usePlaceEnricher } from '@/places/enrichers'
import { usePlaceService } from '@/places/services'

export default {
  components: {
    QCard,
    QIcon,
    QCardSection,
    QInfiniteScroll,
    ActivityList,
    KNotice,
    PlaceList,
  },
  setup () {
    const { groupId } = useCurrentGroupService()
    const { getActivityTypesByGroup } = useActivityService()
    const { getPlacesByGroup } = usePlaceService()
    const enrichActivity = useActivityEnricher()
    const enrichActivityType = useActivityTypeEnricher()
    const enrichPlace = usePlaceEnricher()

    function newDateRoundedTo5Minutes () {
      const roundTo = 1000 * 60 * 5 // 5 minutes
      return new Date(Math.floor(new Date().getTime() / roundTo) * roundTo)
    }

    const {
      isLoading,
      isFetching,
      activities,
      hasNextPage,
      fetchNextPage,
    } = useActivityListQuery({
      groupId,
      // so we can use cached query results for a while, otherwise it'll always be a fresh query
      dateMin: newDateRoundedTo5Minutes(),
      // TODO: add activity type filter for query to backend...
    }, {
      // TODO: consider this a bit more... ideally can speed up the activity rendering so we can keep more results, or just clear extra pages?
      cacheTime: 0,
    })

    // onUnmounted(() => {
    //   console.log('clearing activities?')
    //   remove()
    // })

    function isStartedOrUpcoming (activity) {
      return activity.dateEnd > reactiveNow.value
    }

    async function maybeFetchMore (index, done) {
      if (!isFetching.value && hasNextPage.value) await fetchNextPage()
      done(!hasNextPage.value)
    }

    return {
      maybeFetchMore,
      hasNextPage,
      groupId,
      isLoading,
      activities: computed(() => activities.value.filter(isStartedOrUpcoming).map(enrichActivity)),
      activityTypes: computed(() => getActivityTypesByGroup(groupId).map(enrichActivityType)),
      places: computed(() => getPlacesByGroup(groupId).map(enrichPlace)),
    }
  },
  computed: {
    ...mapGetters({
      activitiesIcsUrl: 'activities/icsUrlForCurrentGroup',
      tokenPending: 'activities/tokenPending',
    }),
    hasNoActivities () {
      if (this.isLoading) return false
      return this.activities && this.activities.length === 0
    },
  },
  methods: {
    ...mapActions({
      detail: 'detail/openForActivity',
    }),
  },
}
</script>

<style scoped lang="sass">
.padding
  padding: 1em

.notice
  .icon
    margin: .1em 0 0 0
  padding: 2em 3em
  transform: translateZ(1px) rotate(-3deg)

  h5
    padding: 0

.manage
  padding: 8px

  q-btn
    display: inline-block
    padding: .3em
</style>
