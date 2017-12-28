<template>
  <div>
    <q-card class="no-shadow grey-border">
      <q-card-title>
        <h5>
          <i
            class="icon fa fa-repeat on-left"
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
            color="secondary"
            icon="fa-plus">
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
          @open="makeVisible('series', series.id)"
          :key="series.id"
          :label="series.rule.byDay.slice().sort(sortByDay).map(dayNameForKey).join(', ')"
          :sublabel="$d(series.startDate, 'timeShort')"
          icon="fa-repeat"
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
              @open="makeVisible('pickup', pickup.id)"
              :key="pickup.id"
              :label="seriesPickupLabel(series, pickup)"
              icon="fa-shopping-basket"
            >
              <pickup-edit
                v-if="visible.pickup[pickup.id]"
                :value="pickup"
                @save="savePickup"
                @destroy="destroyPickup"
                @reset="resetPickup"
                :status="pickup.saveStatus"
              />
            </q-collapsible>
          </q-list>

        </q-collapsible>
      </q-list>
    </q-card>

    <q-card class="no-shadow grey-border">
      <q-card-title>
        <h5>
          <i
            class="icon fa fa-shopping-basket on-left"
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
            color="secondary"
            icon="fa-plus">
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
          @open="makeVisible('pickup', pickup.id)"
          :key="pickup.id"
          :label="$d(pickup.date, 'dateWithDayName')"
          :sublabel="$d(pickup.date, 'timeShort')"
          icon="fa-shopping-basket"
          sparse
        >
          <pickup-edit
            v-if="visible.pickup[pickup.id]"
            :value="pickup"
            @save="savePickup"
            @destroy="destroyPickup"
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
import { QCard, QCardTitle, QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile, QCollapsible, QBtn, QTooltip, QIcon } from 'quasar'
import PickupSeriesEdit from '@/components/Pickups/PickupSeriesEdit'
import PickupEdit from '@/components/Pickups/PickupEdit'

import { dayNameForKey, sortByDay } from '@/i18n'

export default {
  components: {
    QCard, QCardTitle, QItem, QItemSide, QItemMain, QItemTile, QList, QListHeader, QCollapsible, QBtn, PickupSeriesEdit, PickupEdit, QTooltip, QIcon,
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
    dayNameForKey,
    sortByDay,
    seriesPickupLabel (series, pickup) {
      const base = this.$d(pickup.date, 'dateShort')
      const seriesTime = this.$d(series.startDate, 'timeShort')
      const pickupTime = this.$d(pickup.date, 'timeShort')
      if (seriesTime !== pickupTime) {
        return `${base} (${pickupTime})`
      }
      else {
        return base
      }
    },
    ...mapActions({
      saveSeries: 'pickupSeries/save',
      savePickup: 'pickups/save',
    }),
    createNewSeries () {
      this.newSeries = {
        maxCollectors: 2,
        description: '',
        startDate: new Date(),
        store: this.storeId,
        rule: {
          byDay: ['MO'],
          freq: 'WEEKLY',
        },
      }
    },
    async saveNewSeries (series) {
      if ((await this.$store.dispatch('pickupSeries/create', series)) !== false) {
        this.newSeries = null
      }
    },
    cancelNewSeries () {
      this.newSeries = null
    },
    destroySeries (seriesId) {
      this.$store.dispatch('pickupSeries/destroy', seriesId)
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
      if ((await this.$store.dispatch('pickups/create', pickup)) !== false) {
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
    destroyPickup (pickupId) {
      this.$store.dispatch('pickups/destroy', pickupId)
    },
  },
  computed: {
    ...mapGetters({
      storeId: 'stores/activeStoreId',
      pickupSeries: 'pickupSeries/all',
      oneTimePickups: 'pickups/filteredOneTime',
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
</style>
