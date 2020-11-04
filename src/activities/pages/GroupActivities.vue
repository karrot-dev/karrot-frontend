<template>
  <div>
    <ActivityList
      :activities="activities"
      :pending="pending"
      place-link
      filter
      @join="join"
      @leave="leave"
      @detail="detail"
    />
    <template v-if="hasNoActivities">
      <KNotice>
        <template #icon>
          <i class="fas fa-bed" />
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
import {
  QCard,
  QCardSection,
} from 'quasar'

import { mapGetters, mapActions } from 'vuex'

import ActivityList from '@/activities/components/ActivityList'
import KNotice from '@/utils/components/KNotice'
import PlaceList from '@/places/components/PlaceList'
import {
  useActivities,

} from '@/activities/data/useActivities'
import { watchEffect, unref } from '@vue/composition-api'
import { useGlobal } from '@/activities/data/useGlobal'
import { useEnrichedActivities } from '@/activities/data/useEnrichedActivities'
import { useCached } from '@/activities/data/useCached'

export default {
  components: {
    QCard,
    QCardSection,
    ActivityList,
    KNotice,
    PlaceList,
  },
  setup () {
    const { getUser, currentGroupId, authUserId } = useGlobal()
    const { activities, status } = useCached(
      'groupActivities',
      () => useActivities({ groupId: currentGroupId }),
    )
    // const { activities, status } = useActivities({ groupId: currentGroupId })
    const { upcomingAndStarted } = useEnrichedActivities({ activities, authUserId, getUser })
    watchEffect(() => {
      console.log('we have', unref(activities).length, 'activities')
    })
    watchEffect(() => {
      console.log('we have', unref(upcomingAndStarted).length, 'upcomingAndStarted activities')
    })
    watchEffect(() => {
      const { state, startedAt, finishedAt } = status
      console.log('yay status of activities is', unref(state), unref(startedAt), unref(finishedAt))
    })
    return {
      activities: upcomingAndStarted,
      pending: status.pending,
    }
  },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
      // activities: 'activities/byCurrentGroup',
      // pending: 'activities/fetchingForCurrentGroup',
      places: 'places/byCurrentGroup',
    }),
    hasNoActivities () {
      if (this.pending) return false
      return this.activities && this.activities.length === 0
    },
  },
  methods: {
    ...mapActions({
      join: 'activities/join',
      leave: 'activities/leave',
      detail: 'detail/openForActivity',
    }),
  },
}
</script>

<style scoped lang="stylus">
.padding
  padding 1em

.notice
  .icon
    margin .1em 0 0 0
  padding 2em 3em
  transform translateZ(1px) rotate(-3deg)

  h5
    padding 0

.manage
  padding 8px

  q-btn
    display inline-block
    padding .3em
</style>
