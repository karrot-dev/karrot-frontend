<template>
  <div>
    <q-card class="no-shadow grey-border">
      <q-card-title>
        <h5>
          <i
            class="icon fas fa-redo on-left"
            aria-hidden="true"
          />
          {{ $t('PICKUPMANAGE.SERIES') }}
        </h5>
        <div
          slot="right"
          class="row items-center"
        >
          <q-btn
            v-if="!newSeries"
            @click="createNewSeries"
            small
            round
            class="bannerButton hoverScale"
            color="secondary"
            icon="fas fa-plus">
            <q-tooltip v-t="'BUTTON.CREATE'" />
          </q-btn>
        </div>
      </q-card-title>
      <q-item v-if="newSeries" >
        <pickup-series-edit
          :value="newSeries"
          @save="saveNewSeries"
          @cancel="cancelNewSeries"
          @reset="resetNewSeries"
          :status="seriesCreateStatus"
        />
      </q-item>
      <q-list
        class="pickups"
        separator
        no-border
        highlight
        sparse
      >
        <q-collapsible
          v-for="series in pickupSeries"
          @show="makeVisible('series', series.id)"
          :key="series.id"
          :label="seriesLabel(series)"
          :sublabel="$d(series.startDate, 'hourMinute')"
          icon="fas fa-calendar-alt"
          sparse
        >
          <q-item v-if="visible.series[series.id]">
            <pickup-series-edit
              :value="series"
              @save="saveSeries"
              @destroy="destroySeries"
              @reset="resetPickup"
              :status="series.saveStatus"
            />
          </q-item>
          <q-list
            no-border
            seperator
          >
            <q-list-header v-t="'PICKUPMANAGE.UPCOMING_PICKUPS_IN_SERIES'" />
            <q-collapsible
              v-for="pickup in series.pickups"
              @show="makeVisible('pickup', pickup.id)"
              :key="pickup.id"
            >
              <template slot="header">
                <q-item-side
                  v-if="!$q.platform.is.mobile"
                  icon="fas fa-shopping-basket"
                />
                <q-item-main
                  :tag="pickup.isDisabled ? 's' : 'div'"
                  label
                  title="Pickup is disabled"
                >
                  {{ $d(pickup.date, 'yearMonthDay') }}
                  <template v-if="!series.isSameWeekday">
                    ({{ $d(pickup.date, 'dayName') }})
                  </template>
                  <template v-if="!series.isSameHour || !series.isSameMinute">
                    ({{ $d(pickup.date, 'hourMinute') }})
                  </template>
                </q-item-main>
                <q-item-side
                  class="text-bold"
                  right
                >
                  <q-icon
                    v-if="!pickup.seriesMeta.matchesRule"
                    class="text-warning"
                    name="access time"
                    size="150%"
                    title="This pickup doesn't fit in the recurrence rule"
                  />
                  <q-icon
                    v-if="pickup.seriesMeta.isDescriptionChanged"
                    class="text-info"
                    name="info"
                    size="150%"
                    title="Description is changed"
                  />
                  <q-icon
                    v-if="pickup.seriesMeta.isMaxCollectorsChanged"
                    class="text-info"
                    name="group"
                    size="150%"
                    title="Max slots are changed"
                  />
                </q-item-side>
              </template>
              <pickup-edit
                v-if="visible.pickup[pickup.id]"
                :value="pickup"
                @save="savePickup"
                @reset="resetPickup"
                :status="pickup.saveStatus"
              />
            </q-collapsible>
          </q-list>
        </q-collapsible>
      </q-list>
    </q-card>

    <q-card class="no-shadow grey-border secondCard">
      <RandomArt
        class="randomBanner"
        :seed="storeId"
        type="banner"
      />
      <q-card-title>
        <h5>
          <i
            class="icon fas fa-shopping-basket on-left"
            aria-hidden="true"
          />
          {{ $t('PICKUPMANAGE.SINGLE') }}
        </h5>
        <div
          slot="right"
          class="row items-center"
        >
          <q-btn
            v-if="!newPickup"
            @click="createNewPickup"
            small
            round
            class="bannerButton hoverScale"
            color="secondary"
            icon="fas fa-plus"
          >
            <q-tooltip v-t="'BUTTON.CREATE'" />
          </q-btn>
        </div>
      </q-card-title>
      <q-item v-if="newPickup" >
        <pickup-edit
          :value="newPickup"
          @save="saveNewPickup"
          @cancel="cancelNewPickup"
          @reset="resetNewPickup"
          :status="pickupCreateStatus"
        />
      </q-item>
      <q-list
        class="pickups"
        separator
        no-border
      >
        <q-collapsible
          v-for="pickup in oneTimePickups"
          @show="makeVisible('pickup', pickup.id)"
          :key="pickup.id"
          :label="$d(pickup.date, 'dateWithDayName')"
          :sublabel="$d(pickup.date, 'hourMinute')"
          icon="fas fa-calendar-alt"
          sparse
        >
          <pickup-edit
            v-if="visible.pickup[pickup.id]"
            :value="pickup"
            @save="savePickup"
            @reset="resetPickup"
            :status="pickup.saveStatus"
          />
        </q-collapsible>
      </q-list>
    </q-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import {
  QCard,
  QCardTitle,
  QList,
  QListHeader,
  QItem,
  QItemSide,
  QItemMain,
  QItemTile,
  QCollapsible,
  QBtn,
  QTooltip,
  QIcon,
} from 'quasar'
import PickupSeriesEdit from '@/pickups/components/PickupSeriesEdit'
import PickupEdit from '@/pickups/components/PickupEdit'
import RandomArt from '@/utils/components/RandomArt'

import i18n, { dayNameForKey, sortByDay } from '@/base/i18n'

export default {
  components: {
    PickupSeriesEdit,
    PickupEdit,
    RandomArt,
    QCard,
    QCardTitle,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QCollapsible,
    QBtn,
    QTooltip,
    QIcon,
  },
  data () {
    return {
      newSeries: null,
      newPickup: null,
      visible: {
        series: {},
        pickup: {},
      },
    }
  },
  methods: {
    makeVisible (type, id) {
      // prevents rending q-collabsible children before they are displayed
      // if we don't do this, the textarea in pickupEdit won't autogrow
      this.$set(this.visible[type], id, true)
    },
    seriesLabel (series) {
      if (series.rule.isCustom) {
        const label = i18n.t('CREATEPICKUP.CUSTOM')
        return `${label} (${series.rule.custom})`
      }
      return series.rule.byDay.slice().sort(sortByDay).map(dayNameForKey).join(', ')
    },
    ...mapActions({
      createSeries: 'pickupSeries/create',
      saveSeries: 'pickupSeries/save',
      destroySeries: 'pickupSeries/destroy',
      createPickup: 'pickups/create',
      savePickup: 'pickups/save',
    }),
    createNewSeries () {
      this.newSeries = {
        maxCollectors: 2,
        description: '',
        startDate: new Date(),
        store: this.storeId,
        rule: {
          isCustom: false,
          byDay: ['MO'],
          freq: 'WEEKLY',
        },
      }
    },
    async saveNewSeries (series) {
      await this.createSeries(series)
      if (this.seriesCreateStatus.hasValidationErrors) {
        this.newSeries = null
      }
    },
    cancelNewSeries () {
      this.newSeries = null
    },
    createNewPickup () {
      const date = new Date()
      date.setDate(date.getDate() + 1)
      this.newPickup = {
        maxCollectors: 2,
        description: '',
        date,
        store: this.storeId,
      }
    },
    async saveNewPickup (pickup) {
      await this.createPickup(pickup)
      if (this.pickupCreateStatus.hasValidationErrors) {
        this.newPickup = null
      }
    },
    cancelNewPickup () {
      this.newPickup = null
      this.resetNewPickup()
    },
    resetSeries (seriesId) {
      this.$store.dispatch('pickups/meta/clear', ['save', seriesId])
    },
    resetNewSeries () {
      this.$store.dispatch('pickupSeries/meta/clear', ['create'])
    },
    resetNewPickup () {
      this.$store.dispatch('pickups/meta/clear', ['create'])
    },
    resetPickup (pickupId) {
      this.$store.dispatch('pickups/meta/clear', ['save', pickupId])
    },
  },
  computed: {
    ...mapGetters({
      storeId: 'stores/activeStoreId',
      pickupSeries: 'pickupSeries/byActiveStore',
      oneTimePickups: 'pickups/byActiveStoreOneTime',
      pickupCreateStatus: 'pickups/createStatus',
      seriesCreateStatus: 'pickupSeries/createStatus',
    }),
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.pickups
  background-color white
button.selected
  background-color $grey-4

.bannerButton
  margin-top -64px

.secondCard
  margin-top 24px !important
  .randomBanner
    display: block
    height: 26px
    overflow: hidden
</style>
