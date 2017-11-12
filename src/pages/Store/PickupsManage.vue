<template>
  <div>
    <h3 v-t="'PICKUPMANAGE.TITLE'" />
    <q-card>
      <q-card-title>
        <h5>
          <i class="icon fa fa-repeat on-left" aria-hidden="true" />
          {{ $t('PICKUPMANAGE.SERIES') }}
        </h5>
        <div slot="right" class="row items-center">
          <q-btn @click="createNewSeries">
            <q-icon name="fa-plus-circle" />
            <q-tooltip v-t="'BUTTON.CREATE'" />
          </q-btn>
        </div>
      </q-card-title>
      <q-item v-if="newSeries" >
        <pickup-series-edit :series="newSeries" :isWaiting="seriesIsWaiting" :requestError="seriesError" @save="saveNewSeries" @cancel="cancelNewSeries"/>
      </q-item>

      <q-list class="pickups" separator no-border highlight sparse>
        <q-collapsible v-for="series in pickupSeries"
                       :key="series.id"
                       :label="series.rule.byDay.slice().sort(sortByDay).map(dayNameForKey).join(', ')"
                       :sublabel="$d(series.startDate, 'timeShort')"
                       icon="fa-calendar" sparse>

          <q-item>
            <pickup-series-edit :series="series.__unenriched" :isWaiting="seriesIsWaiting" :requestError="seriesError" @save="saveSeries" @destroy="destroySeries" />
          </q-item>

          <q-list no-border seperator>
            <q-list-header v-t="'PICKUPMANAGE.UPCOMING_PICKUPS_IN_SERIES'" />

            <q-collapsible v-for="pickup in series.pickups"
                           :key="pickup.id"
                           :label="seriesPickupLabel(series, pickup)"
                           icon="fa-calendar">
              <pickup-edit :pickup="pickup.__unenriched" @save="savePickup" :isWaiting="pickupIsWaiting" :requestError="pickupsError" />
            </q-collapsible>
          </q-list>

        </q-collapsible>
      </q-list>
    </q-card>

    <q-card>
      <q-card-title>
        <h5>
          <i class="icon fa fa-shopping-basket on-left" aria-hidden="true" />
          {{ $t('PICKUPMANAGE.SINGLE') }}
        </h5>
        <div slot="right" class="row items-center">
          <q-btn @click="createNewPickup">
            <q-icon name="fa-plus-circle" />
            <q-tooltip v-t="'BUTTON.CREATE'" />
          </q-btn>
        </div>
      </q-card-title>

      <q-item v-if="newPickup" >
        <pickup-edit :pickup="newPickup" @save="saveNewPickup" @cancel="cancelNewPickup" :isWaiting="pickupIsWaiting" :requestError="pickupsError" />
      </q-item>

      <q-list class="pickups" separator no-border>
        <q-collapsible v-for="pickup in oneTimePickups"
                       :key="pickup.id"
                       :label="$d(pickup.date, 'dateShort')"
                       :sublabel="$d(pickup.date, 'timeShort')"
                       icon="fa-calendar" sparse>
          <pickup-edit :pickup="pickup.__unenriched" @save="savePickup" @destroy="destroyPickup" :isWaiting="pickupIsWaiting" :requestError="pickupsError" />
        </q-collapsible>
      </q-list>
    </q-card>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { QCard, QCardTitle, QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile, QCollapsible, QBtn } from 'quasar'
import PickupSeriesEdit from '@/components/Pickups/PickupSeriesEdit'
import PickupEdit from '@/components/Pickups/PickupEdit'

import { dayNameForKey, sortByDay } from '@/i18n'

export default {
  components: { QCard, QCardTitle, QItem, QItemSide, QItemMain, QItemTile, QList, QListHeader, QCollapsible, QBtn, PickupSeriesEdit, PickupEdit },
  data () {
    return {
      newSeries: null,
      newPickup: null,
    }
  },
  methods: {
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
    saveNewSeries (series) {
      this.$store.dispatch('pickupSeries/create', series)
      this.newSeries = null
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
    saveNewPickup (pickup) {
      this.$store.dispatch('pickups/create', pickup)
      this.newPickup = null
    },
    cancelNewPickup () {
      this.newPickup = null
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
      pickupIsWaiting: 'pickups/saveIsWaiting',
      pickupsError: 'pickups/saveError',
      seriesIsWaiting: 'pickupSeries/saveIsWaiting',
      seriesError: 'pickupSeries/saveError',
    }),
  },
  mounted () {
    this.$store.dispatch('pickupSeries/fetchListForActiveStore')
  },
  destroyed () {
    this.$store.dispatch('pickupSeries/clearList')
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
