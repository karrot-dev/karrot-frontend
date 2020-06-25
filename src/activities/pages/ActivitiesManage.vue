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
        <QBtn
          v-if="!newSeries"
          size="sm"
          round
          color="secondary"
          icon="fas fa-plus"
          :title="$t('BUTTON.CREATE')"
          @click="createNewSeries"
        />
      </QCardSection>
      <QItem v-if="newSeries">
        <ActivitySeriesEdit
          :value="newSeries"
          :status="seriesCreateStatus"
          @save="saveNewSeries"
          @cancel="cancelNewSeries"
          @reset="resetNewSeries"
        />
      </QItem>
      <KSpinner v-show="fetchActivitySeriesStatus.pending" />
      <QList
        separator
      >
        <QExpansionItem
          v-for="series in activitySeries"
          :key="series.id"
          :label="seriesLabel(series)"
          :sublabel="seriesSublabel(series)"
          icon="fas fa-calendar-alt"
          @show="makeVisible('series', series.id)"
        >
          <QItem v-if="visible.series[series.id]">
            <ActivitySeriesEdit
              :value="series"
              :status="series.saveStatus"
              @save="saveSeries"
              @destroy="destroySeries"
              @reset="resetActivity"
            />
          </QItem>
          <QList
            seperator
          >
            <QItemLabel
              header
            >
              <span v-t="'ACTIVITYMANAGE.UPCOMING_ACTIVITYS_IN_SERIES'" />
            </QItemLabel>
            <QExpansionItem
              v-for="activity in series.activities"
              :key="activity.id"
              dense
              @show="makeVisible('activity', activity.id)"
            >
              <template #header>
                <QItemSection
                  v-if="!$q.platform.is.mobile"
                  side
                >
                  <QIcon :name="$icon('activity')" />
                </QItemSection>
                <QItemSection>
                  <QItemLabel
                    :tag="activity.isDisabled ? 's' : 'div'"
                    :title="activity.isDisabled ? $t('ACTIVITYLIST.ACTIVITY_DISABLED') : null"
                  >
                    {{ $d(activity.date, 'yearMonthDay') }}
                    <template v-if="!series.isSameWeekday">
                      ({{ $d(activity.date, 'dayName') }})
                    </template>
                    <template v-if="!series.isSameHour || !series.isSameMinute">
                      ({{ $d(activity.date, 'hourMinute') }})
                    </template>
                  </QItemLabel>
                </QItemSection>
                <QItemSection
                  side
                  class="text-bold"
                >
                  <QIcon
                    v-if="!activity.seriesMeta.matchesRule"
                    class="text-warning"
                    name="access_time"
                    size="150%"
                    :title="$t('ACTIVITYMANAGE.ACTIVITY_DOES_NOT_MATCH')"
                  />
                  <QIcon
                    v-if="activity.seriesMeta.isDescriptionChanged"
                    class="text-warning"
                    name="info"
                    size="150%"
                    :title="$t('ACTIVITYMANAGE.ACTIVITY_DESCRIPTION_CHANGED')"
                  />
                  <QIcon
                    v-if="activity.seriesMeta.isMaxParticipantsChanged"
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
                :status="activity.saveStatus"
                :series="series"
                @save="saveActivity"
                @reset="resetActivity"
              />
            </QExpansionItem>
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
        <QBtn
          v-if="!newActivity"
          size="sm"
          round
          color="secondary"
          icon="fas fa-plus"
          :title="$t('BUTTON.CREATE')"
          @click="createNewActivity"
        />
      </QCardSection>
      <QItem v-if="newActivity">
        <ActivityEdit
          :value="newActivity"
          :status="activityCreateStatus"
          @save="saveNewActivity"
          @cancel="cancelNewActivity"
          @reset="resetNewActivity"
        />
      </QItem>
      <KSpinner v-show="fetchActivityPending" />
      <QList
        class="activities"
        separator
      >
        <QExpansionItem
          v-for="activity in oneTimeActivities"
          :key="activity.id"
          @show="makeVisible('activity', activity.id)"
        >
          <template #header>
            <QItemSection
              v-if="!$q.platform.is.mobile"
              side
            >
              <QIcon name="fas fa-calendar-alt" />
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
            :status="activity.saveStatus"
            @save="saveActivity"
            @reset="resetActivity"
          />
        </QExpansionItem>
      </QList>
    </QCard>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  QCard,
  QCardSection,
  QList,
  QItemLabel,
  QItem,
  QItemSection,
  QExpansionItem,
  QBtn,
  QIcon,
} from 'quasar'
import ActivitySeriesEdit from '@/activities/components/ActivitySeriesEdit'
import ActivityEdit from '@/activities/components/ActivityEdit'
import RandomArt from '@/utils/components/RandomArt'
import KSpinner from '@/utils/components/KSpinner'

import i18n, { dayNameForKey, sortByDay } from '@/base/i18n'

import addSeconds from 'date-fns/addSeconds'
import addHours from 'date-fns/addHours'
import startOfTomorrow from 'date-fns/startOfTomorrow'
import { defaultDuration } from '@/activities/settings'

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
    QBtn,
    QIcon,
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
  computed: {
    ...mapGetters({
      placeId: 'places/activePlaceId',
      activitySeries: 'activitySeries/byActivePlace',
      fetchActivitySeriesStatus: 'activitySeries/fetchListForActivePlaceStatus',
      activities: 'activities/byActivePlace',
      fetchActivityPending: 'activities/fetchingForCurrentGroup',
      activityCreateStatus: 'activities/createStatus',
      seriesCreateStatus: 'activitySeries/createStatus',
    }),
    oneTimeActivities () {
      // filter out already started activities
      return this.activities.filter(p => !p.series && !p.hasStarted)
    },
  },
  methods: {
    makeVisible (type, id) {
      // prevents rending QCollabsible children before they are displayed
      // if we don't do this, the textarea in activityEdit won't autogrow
      this.$set(this.visible[type], id, true)
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
    ...mapActions({
      createSeries: 'activitySeries/create',
      saveSeries: 'activitySeries/save',
      destroySeries: 'activitySeries/destroy',
      createActivity: 'activities/create',
      saveActivity: 'activities/save',
    }),
    createNewSeries () {
      this.newSeries = {
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
      if (!this.seriesCreateStatus.hasValidationErrors) {
        this.newSeries = null
      }
    },
    cancelNewSeries () {
      this.newSeries = null
    },
    createNewActivity () {
      const date = addHours(startOfTomorrow(), 10) // default to 10am tomorrow
      this.newActivity = {
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
      if (!this.activityCreateStatus.hasValidationErrors) {
        this.newActivity = null
      }
    },
    cancelNewActivity () {
      this.newActivity = null
      this.resetNewActivity()
    },
    resetNewSeries () {
      this.$store.dispatch('activitySeries/meta/clear', ['create'])
    },
    resetSeries (seriesId) {
      this.$store.dispatch('activitySeries/meta/clear', ['save', seriesId])
    },
    resetNewActivity () {
      this.$store.dispatch('activities/meta/clear', ['create'])
    },
    resetActivity (activityId) {
      this.$store.dispatch('activities/meta/clear', ['save', activityId])
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'

button.selected
  background-color $grey-4

.secondCard
  margin-top 24px !important

  .randomBanner
    display block
    height 26px
    overflow hidden
</style>
