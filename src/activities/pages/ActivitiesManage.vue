<template>
  <div>
    <QCard class="no-shadow grey-border">
      <QCardSection class="row justify-between no-wrap q-mb-md">
        <div class="text-h6">
          <i
            class="fas fa-redo on-left"
          />
          {{ $t('ACTIVITYMANAGE.SERIES') }}
        </div>
        <QFab
          v-if="!newSeries"
          class="fab-top-fix"
          vertical-actions-align="right"
          size="sm"
          color="secondary"
          icon="fas fa-plus"
          direction="down"
        >
          <QFabAction
            v-for="activityType in activityTypes"
            :key="activityType.id"
            class="fab-action-fix"
            label-position="left"
            v-bind="getIconProps(activityType)"
            @click="createNewSeries(activityType)"
          />
          <QFabAction
            class="fab-action-fix bg-white"
            :label="$t('ACTIVITY_TYPES.MANAGE_TYPES')"
            outline
            :to="{ name: 'groupEditActivityTypes' }"
          />
        </QFab>
      </QCardSection>
      <QItem v-if="newSeries">
        <ActivitySeriesEdit
          :value="newSeries"
          :status="createSeriesStatus"
          @save="saveNewSeries"
          @cancel="cancelNewSeries"
          @reset="resetNewSeries"
        />
      </QItem>
      <KSpinner v-show="isLoadingActivitySeries" />
      <QList
        separator
      >
        <QExpansionItem
          v-for="series in activitySeries"
          :key="series.id"
          group="series"
          @show="showSeries(series.id)"
          @hide="hideSeries(series.id)"
        >
          <template #header>
            <QItemSection side>
              <QIcon
                v-if="series.activityType"
                v-bind="getIconProps(getActivityTypeById(series.activityType))"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel>
                {{ seriesLabel(series) }}
              </QItemLabel>
              <QItemLabel caption>
                {{ seriesSublabel(series) }}
              </QItemLabel>
            </QItemSection>
          </template>
          <QItem v-if="visible.series[series.id]">
            <ActivitySeriesEdit
              :value="series"
              :status="saveSeriesStatus"
              @save="saveSeries"
              @destroy="destroySeries"
              @reset="resetActivity"
            />
          </QItem>
          <QList
            v-if="visibleSeriesId === series.id"
            seperator
          >
            <QItemLabel
              header
            >
              <QToggle v-model="showSeriesActivities">
                <span v-t="'ACTIVITYMANAGE.UPCOMING_ACTIVITIES_IN_SERIES'" />
              </QToggle>
            </QItemLabel>
            <template v-if="showSeriesActivities">
              <QExpansionItem
                v-for="activity in activitySeriesActivities"
                :key="activity.id"
                dense
                group="series-activity"
                @show="makeVisible('activity', activity.id)"
              >
                <template #header>
                  <QItemSection side>
                    <QIcon
                      v-if="activity.activityType"
                      v-bind="getIconProps(getActivityTypeById(activity.activityType))"
                    />
                  </QItemSection>
                  <QItemSection>
                    <QItemLabel
                      :tag="activity.isDisabled ? 's' : 'div'"
                      :title="activity.isDisabled ? $t('ACTIVITYLIST.ACTIVITY_DISABLED') : null"
                    >
                      {{ $d(activity.date, 'yearMonthDay') }}
                      <template v-if="!similarities.isSameWeekday">
                        ({{ $d(activity.date, 'dayName') }})
                      </template>
                      <template v-if="!similarities.isSameHour || !similarities.isSameMinute">
                        ({{ $d(activity.date, 'hourMinute') }})
                      </template>
                    </QItemLabel>
                  </QItemSection>
                  <QItemSection
                    side
                    class="text-bold"
                  >
                    <QIcon
                      v-if="!matchesRule(series, activity)"
                      class="text-warning"
                      name="access_time"
                      size="150%"
                      :title="$t('ACTIVITYMANAGE.ACTIVITY_DOES_NOT_MATCH')"
                    />
                    <QIcon
                      v-if="isDescriptionChanged(series, activity)"
                      class="text-warning"
                      name="info"
                      size="150%"
                      :title="$t('ACTIVITYMANAGE.ACTIVITY_DESCRIPTION_CHANGED')"
                    />
                    <QIcon
                      v-if="isMaxParticipantsChanged(series, activity)"
                      class="text-warning"
                      name="group"
                      size="150%"
                      :title="$t('ACTIVITYMANAGE.ACTIVITY_MAX_PARTICIPANTS_CHANGED')"
                    />
                  </QItemSection>
                </template>
                <ActivityEdit
                  v-if="visible.activity[activity.id]"
                  :value="activity"
                  :status="saveActivityStatus"
                  :series="series"
                  @save="saveActivity"
                  @reset="resetActivity"
                />
              </QExpansionItem>
            </template>
          </QList>
        </QExpansionItem>
      </QList>
    </QCard>

    <QCard class="no-shadow grey-border secondCard">
      <RandomArt
        class="randomBanner"
        :seed="placeId"
        type="banner"
      />
      <QCardSection class="row justify-between no-wrap q-mb-md">
        <div class="text-h6">
          <i
            class="on-left"
            :class="$icon('activity')"
          />
          {{ $t('ACTIVITYMANAGE.SINGLE') }}
        </div>
        <QFab
          v-if="!newActivity"
          vertical-actions-align="right"
          size="sm"
          color="secondary"
          icon="fas fa-plus"
          direction="down"
        >
          <QFabAction
            v-for="activityType in activityTypes"
            :key="activityType.id"
            class="fab-action-fix"
            label-position="left"
            v-bind="getIconProps(activityType)"
            @click="createNewActivity(activityType)"
          />
          <QFabAction
            class="fab-action-fix bg-white"
            :label="$t('ACTIVITY_TYPES.MANAGE_TYPES')"
            outline
            :to="{ name: 'groupEditActivityTypes' }"
          />
        </QFab>
      </QCardSection>
      <QItem v-if="newActivity">
        <ActivityEdit
          :value="newActivity"
          :status="createActivityStatus"
          @save="saveNewActivity"
          @cancel="cancelNewActivity"
          @reset="resetNewActivity"
        />
      </QItem>
      <KSpinner v-show="isLoadingActivities" />
      <QList
        class="activities"
        separator
      >
        <QExpansionItem
          v-for="activity in activities"
          :key="activity.id"
          group="activity"
          @show="makeVisible('activity', activity.id)"
        >
          <template #header>
            <QItemSection side>
              <QIcon
                v-if="activity.activityType"
                v-bind="getIconProps(getActivityTypeById(activity.activityType))"
              />
            </QItemSection>
            <QItemSection>
              <QItemLabel
                :tag="activity.isDisabled ? 's' : 'div'"
                :title="activity.isDisabled ? $t('ACTIVITYLIST.ACTIVITY_DISABLED') : null"
              >
                {{ $d(activity.date, 'dateWithDayName') }}
              </QItemLabel>
              <QItemLabel caption>
                {{ $d(activity.date, 'hourMinute') }}
                <template v-if="activity.hasDuration">
                  &mdash; {{ $d(activity.dateEnd, 'hourMinute') }}
                </template>
              </QItemLabel>
            </QItemSection>
          </template>
          <ActivityEdit
            v-if="visible.activity[activity.id]"
            :value="activity"
            :status="saveActivityStatus"
            @save="saveActivity"
            @reset="resetActivity"
          />
        </QExpansionItem>
      </QList>
    </QCard>
  </div>
</template>

<script>
import addHours from 'date-fns/addHours'
import addSeconds from 'date-fns/addSeconds'
import startOfTomorrow from 'date-fns/startOfTomorrow'
import {
  QCard,
  QCardSection,
  QList,
  QItemLabel,
  QItem,
  QItemSection,
  QExpansionItem,
  QIcon,
  QFab,
  QFabAction,
  QToggle,
} from 'quasar'
import { ref, computed } from 'vue'

import { useActivityHelpers, useActivityTypeHelpers } from '@/activities/helpers'
import {
  useCreateActivityMutation,
  useCreateActivitySeriesMutation,
  useDestroyActivitySeriesMutation,
  useSaveActivityMutation,
  useSaveActivitySeriesMutation,
} from '@/activities/mutations'
import { useActivityListQuery, useActivitySeriesListQuery } from '@/activities/queries'
import { useActivityTypeService } from '@/activities/services'
import { defaultDuration } from '@/activities/settings'
import i18n, { dayNameForKey, sortByDay } from '@/base/i18n'
import { useCurrentGroupService } from '@/group/services'
import { useActivePlaceService } from '@/places/services'

import ActivityEdit from '@/activities/components/ActivityEdit'
import ActivitySeriesEdit from '@/activities/components/ActivitySeriesEdit'
import KSpinner from '@/utils/components/KSpinner'
import RandomArt from '@/utils/components/RandomArt'

export default {
  components: {
    ActivitySeriesEdit,
    ActivityEdit,
    RandomArt,
    KSpinner,
    QCard,
    QCardSection,
    QList,
    QItemLabel,
    QItem,
    QItemSection,
    QExpansionItem,
    QIcon,
    QFab,
    QFabAction,
    QToggle,
  },
  setup () {
    // TODO: this component is doing way too much stuff... split it up! But I think could do with some UI changes too...

    const { groupId } = useCurrentGroupService()
    const { placeId } = useActivePlaceService()

    const { getIsUpcoming } = useActivityHelpers()

    // Activity Types

    const {
      getActivityTypeById,
      getActivityTypesByGroup,
    } = useActivityTypeService()

    const {
      getIconProps,
    } = useActivityTypeHelpers()

    const activityTypes = computed(() => getActivityTypesByGroup(groupId, { status: 'active' }))

    // Activities

    const {
      mutateAsync: createActivity, // using the async version as we await the result later
      status: createActivityStatus,
      reset: resetNewActivity,
    } = useCreateActivityMutation()

    const {
      mutate: saveActivity,
      status: saveActivityStatus,
      reset: resetActivity,
    } = useSaveActivityMutation()

    const {
      isLoading: isLoadingActivities,
      activities: activitiesRaw,
    } = useActivityListQuery({
      placeId,
      pageSize: 1000,
    })

    // TODO: can I filter out series ones on the server?
    const activities = computed(() => activitiesRaw.value
      .filter(activity => !activity.series)
      .filter(getIsUpcoming))

    // Activity Series

    const {
      mutate: createSeries,
      reset: resetNewSeries,
      status: createSeriesStatus,
    } = useCreateActivitySeriesMutation()

    const {
      mutate: saveSeriesMutate,
      reset: resetSeries,
      status: saveSeriesStatus,
    } = useSaveActivitySeriesMutation()

    const {
      mutate: destroySeries,
    } = useDestroyActivitySeriesMutation()

    const {
      isLoading: isLoadingActivitySeries,
      activitySeries,
    } = useActivitySeriesListQuery({
      placeId,
    })

    // Series currently visible in the accordian
    const visibleSeriesId = ref(null)

    // Whether to show the activities for the series
    const showSeriesActivities = ref(false)

    // Activities for visible series
    const {
      activities: activitySeriesActivities,
      isLoading: isLoadingActivitySeriesActivities,
    } = useActivityListQuery({
      seriesId: visibleSeriesId,
      pageSize: 100,
    }, {
      enabled: computed(() => Boolean(visibleSeriesId) && showSeriesActivities.value),
    })

    // This is to avoid showing repetitive information about series activities, e.g. if they are all Saturday, don't need to show "Saturday"
    // We calculate which aspects of the activities are all the same, and only display relevant values where they are not uniform
    const similarities = computed(() => {
      const firstDate = activitySeriesActivities.value?.length > 0 && activitySeriesActivities.value[0].date
      if (!firstDate) return {}
      const isSame = lookup => activitySeriesActivities.value.every(p => p.date[lookup]() === firstDate[lookup]())
      return {
        isSameWeekday: isSame('getDay'),
        isSameHour: isSame('getHours'),
        isSameMinute: isSame('getMinutes'),
      }
    })

    function saveSeries (series) {
      // Hiding these, as when we update a series it causes a volley of websocket updates for each activity, which then causes a load of reloads
      // TODO: consider doing something better about that problem
      showSeriesActivities.value = false
      saveSeriesMutate(series)
    }

    /*
    TODO: reimplement this somewhere, I think better on the server side...? esp. the matchesRule one... my upcoming work for participant types also impacted this area
    isPending (val) {
      const hasExceptions = () => {
        const { activities } = this.edit
        return activities.some(({ seriesMeta }) => seriesMeta.isDescriptionChanged || seriesMeta.isMaxParticipantsChanged || !seriesMeta.matchesRule)
      }
      if (!val && !this.hasAnyError && hasExceptions()) {
        Dialog.create({
          title: this.$t('CREATEACTIVITY.EXCEPTIONS_TITLE'),
          message: this.$t('CREATEACTIVITY.EXCEPTIONS_MESSAGE', { upcomingLabel: this.$t('ACTIVITYMANAGE.UPCOMING_ACTIVITIES_IN_SERIES') }),
          ok: this.$t('BUTTON.YES'),
        })
      }
    },
     */

    // Utils
    const isDescriptionChanged = (series, activity) => series.description !== activity.description
    const isMaxParticipantsChanged = (series, activity) => series.maxParticipants !== activity.maxParticipants
    const matchesRule = (series, activity) => series.datesPreview && series.datesPreview.some(d => Math.abs(d - activity.date) < 1000)

    return {
      getActivityTypeById,
      getIconProps,

      placeId,

      activityTypes,

      isLoadingActivities,
      activities,

      createActivity,
      createActivityStatus,
      resetNewActivity,

      saveActivity,
      saveActivityStatus,
      resetActivity,

      isLoadingActivitySeries,
      activitySeries,

      createSeries,
      createSeriesStatus,
      resetNewSeries,

      saveSeries,
      saveSeriesStatus,
      resetSeries,

      visibleSeriesId,
      showSeriesActivities,
      activitySeriesActivities,
      similarities,
      isLoadingActivitySeriesActivities,

      destroySeries,

      isDescriptionChanged,
      isMaxParticipantsChanged,
      matchesRule,
    }
  },
  data () {
    return {
      newSeries: null,
      newActivity: null,
      visible: {
        series: {},
        activity: {},
      },
    }
  },
  methods: {
    showSeries (id) {
      this.makeVisible('series', id)
      this.visibleSeriesId = id
    },
    hideSeries (id) {
      if (this.visibleSeriesId === id) {
        this.visibleSeriesId = null
      }
    },
    makeVisible (type, id) {
      // prevents rending QCollabsible children before they are displayed
      // if we don't do this, the textarea in activityEdit won't autogrow
      this.visible[type][id] = true
    },
    seriesLabel (series) {
      if (series.rule.isCustom) {
        const label = i18n.t('CREATEACTIVITY.CUSTOM')
        return `${label} (${series.rule.custom})`
      }
      return series.rule.byDay.slice().sort(sortByDay).map(dayNameForKey).join(', ')
    },
    seriesSublabel (series) {
      const formatDate = date => i18n.d(date, 'hourMinute')
      if (series.duration) {
        return [
          series.startDate,
          addSeconds(series.startDate, series.duration),
        ].map(formatDate).join(' — ')
      }
      return formatDate(series.startDate)
    },
    createNewSeries (activityType) {
      this.newSeries = {
        activityType,
        maxParticipants: 2,
        description: '',
        startDate: addHours(startOfTomorrow(), 10),
        duration: null,
        place: this.placeId,
        rule: {
          isCustom: false,
          byDay: ['MO'],
          freq: 'WEEKLY',
        },
      }
    },
    async saveNewSeries (series) {
      await this.createSeries(series)
      if (!this.createSeriesStatus.hasValidationErrors) {
        this.newSeries = null
      }
    },
    cancelNewSeries () {
      this.newSeries = null
    },
    createNewActivity (activityType) {
      const date = addHours(startOfTomorrow(), 10) // default to 10am tomorrow
      this.newActivity = {
        activityType,
        maxParticipants: 2,
        description: '',
        date,
        dateEnd: addSeconds(date, defaultDuration),
        place: this.placeId,
        hasDuration: false,
      }
    },
    async saveNewActivity (activity) {
      await this.createActivity(activity)
      if (!this.createActivityStatus.hasValidationErrors) {
        this.newActivity = null
      }
    },
    cancelNewActivity () {
      this.newActivity = null
      this.resetNewActivity()
    },
  },
}
</script>

<style scoped lang="sass">
button.selected
  background-color: $grey-4

.secondCard
  margin-top: 24px !important

  .randomBanner
    display: block
    height: 26px
    overflow: hidden

// let the top fab (series) display over the top of the lower one (one-off activities)
.fab-top-fix
  z-index: $z-fab + 1

// for some reason the font-awesome icons are displayed too big inside QFabAction
.fab-action-fix
  ::v-deep(.q-icon.fas)
    font-size: 18px
</style>
