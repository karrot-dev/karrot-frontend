<template>
  <div>
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
import { computed, unref } from 'vue'
import {
  QCard,
  QIcon,
  QCardSection,
} from 'quasar'

import { useStore, mapGetters, mapActions } from 'vuex'

import ActivityList from '@/activities/components/ActivityList'
import KNotice from '@/utils/components/KNotice'
import PlaceList from '@/places/components/PlaceList'
import { useActivityListQuery } from '@/activities/queries'
import { useCurrentGroupIdRef } from '@/group/queries'
import { useStorePlaces } from '@/places/queries'
import { useCurrentUserIdRef, useStoreUsers } from '@/users/queries'
import reactiveNow from '@/utils/reactiveNow'

export default {
  components: {
    QCard,
    QIcon,
    QCardSection,
    ActivityList,
    KNotice,
    PlaceList,
  },
  setup () {
    const group = useCurrentGroupIdRef()

    function newDateRoundedTo5Minutes () {
      const roundTo = 1000 * 60 * 5 // 5 minutes
      return new Date(Math.floor(new Date().getTime() / roundTo) * roundTo)
    }

    const {
      isLoading,
      activities: activitiesRaw,
    } = useActivityListQuery({
      group,
      // so we can use cached query results for a while, otherwise it'll always be a fresh query
      dateMin: newDateRoundedTo5Minutes(),
    })

    const { getEnrichedPlace } = useStorePlaces()
    const { getEnrichedUser } = useStoreUsers()
    const userId = useCurrentUserIdRef()

    const store = useStore()

    // TODO: move to activity type queries file
    function getEnrichedActivityType (id) {
      return store.getters['activityTypes/get'](unref(id))
    }

    function isStartedOrUpcoming (activity) {
      return activity.dateEnd > reactiveNow.value
    }

    const activities = computed(() => {
      return activitiesRaw.value.filter(isStartedOrUpcoming).map(activity => {
        return {
          ...activity,
          _source: activity,

          // calculated values
          isUserMember: activity.participants.includes(userId.value),
          isEmpty: activity.participants.length === 0,
          isFull: activity.maxParticipants > 0 && activity.participants.length >= activity.maxParticipants,
          hasStarted: activity.date <= reactiveNow.value && activity.dateEnd > reactiveNow.value,

          // related objects
          // group
          activityType: getEnrichedActivityType(activity.activityType),
          place: getEnrichedPlace(activity.place),
          // TODO: do we need enriched users here or not?
          feedbackGivenBy: activity.feedbackGivenBy.map(getEnrichedUser),
          feedbackDismissedBy: activity.feedbackDismissedBy.map(getEnrichedUser),
          participants: activity.participants.map(getEnrichedUser),
        }
      })
    })

    return {
      isLoading,
      activities,
    }
  },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
      activitiesIcsUrl: 'activities/icsUrlForCurrentGroup',
      activityTypes: 'activityTypes/byCurrentGroup',
      tokenPending: 'activities/tokenPending',
      places: 'places/byCurrentGroup',
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
