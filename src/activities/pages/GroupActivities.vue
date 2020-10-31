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
import { useGlobalActivities } from '@/activities/data/use-activities'
import { watchEffect } from '@vue/composition-api'

export default {
  components: {
    QCard,
    QCardSection,
    ActivityList,
    KNotice,
    PlaceList,
  },
  setup () {
    const { activities, activityIds, status } = useGlobalActivities()
    watchEffect(() => {
      console.log('FOO activityIds are', activityIds.value)
    })
    watchEffect(() => {
      const { state, startedAt, finishedAt } = status
      console.log('yay status of activities is', state, startedAt, finishedAt)
    })
    return {
      activities2: activities,
    }
  },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
      activities: 'activities/byCurrentGroup',
      pending: 'activities/fetchingForCurrentGroup',
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
