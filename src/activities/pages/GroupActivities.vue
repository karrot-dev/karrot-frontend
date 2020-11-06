<template>
  <div>
    <ActivityList
      :activities="activities"
      :pending="pending"
      place-link
      filter
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
import { useCachedActivities } from '@/activities/data/useActivities'
import { watchEffect, unref } from '@vue/composition-api'
import { useEnrichedActivities } from '@/activities/data/useEnrichedActivities'
import { useAuthUser } from '@/activities/data/useAuthUser'
import { useGlobalUsers } from '@/activities/data/useUsers'
import { useCurrentGroup } from '@/activities/data/useCurrentGroup'

export default {
  components: {
    QCard,
    QCardSection,
    ActivityList,
    KNotice,
    PlaceList,
  },
  setup () {
    const { authUserId } = useAuthUser()
    const { getUser } = useGlobalUsers()
    const { currentGroupId: groupId } = useCurrentGroup()
    const { activities, status } = useCachedActivities('groupActivities')
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
      groupId,
      activities: upcomingAndStarted,
      pending: status.pending,
    }
  },
  computed: {
    ...mapGetters({
      // groupId: 'currentGroup/id',
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
