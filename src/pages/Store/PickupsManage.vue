<template>
  <div>
    <h3>
      <i class="icon fa fa-shopping-basket" aria-hidden="true"></i>
      {{ $t('PICKUPMANAGE.SERIES') }} <q-btn @click="createNewSeries">Create new</q-btn>
    </h3>

    <q-card>

      <q-item v-if="newSeries" >
        <pickup-series-edit :series="newSeries" @save="saveNewSeries" @cancel="cancelNewSeries"/>
      </q-item>

      <q-list class="pickups" separator no-border highlight sparse>
        <q-collapsible v-for="series in pickupSeries"
                       :key="series.id"
                       :label="series.rule.byDay.slice().sort(sortByDay).map(dayNameForKey).join(', ')"
                       :sublabel="$d(series.startDate, 'timeShort')"
                       icon="fa-calendar" sparse>

          <q-item>
            <pickup-series-edit :series="series.__unenriched" @save="saveSeries" @destroy="destroySeries"/>
          </q-item>

          <q-list no-border seperator>
            <q-list-header>Upcoming pickups in this series</q-list-header>

            <q-collapsible v-for="pickup in series.pickups"
                           :key="pickup.id"
                           :label="seriesPickupLabel(series, pickup)"
                           icon="fa-calendar">
              <pickup-edit :pickup="pickup.__unenriched" @save="savePickup"/>
            </q-collapsible>
          </q-list>

        </q-collapsible>
      </q-list>
    </q-card>

    <h3>
      <i class="icon fa fa-shopping-basket" aria-hidden="true"></i>
      {{ $t('PICKUPMANAGE.SINGLE') }}
    </h3>

    <q-card>
      <q-list class="pickups" separator no-border>
        <q-collapsible v-for="pickup in oneTimePickups"
                       :key="pickup.id"
                       :label="$d(pickup.date, 'dateShort')"
                       :sublabel="$d(pickup.date, 'timeShort')"
                       icon="fa-calendar" sparse>
          <pickup-edit :pickup="pickup.__unenriched" @save="savePickup"/>
        </q-collapsible>
      </q-list>
    </q-card>

  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import { Dialog, QCard, QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile, QCollapsible, QBtn } from 'quasar'
import PickupSeriesEdit from '@/components/Pickups/PickupSeriesEdit'
import PickupEdit from '@/components/Pickups/PickupEdit'

import { dayNameForKey, sortByDay } from '@/i18n'

export default {
  components: { QCard, QItem, QItemSide, QItemMain, QItemTile, QList, QListHeader, QCollapsible, QBtn, PickupSeriesEdit, PickupEdit },
  data () {
    return {
      newSeries: null,
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
    destroySeries (seriesId) {
      Dialog.create({
        title: 'Confirm',
        message: 'You really want to delete the series?',
        buttons: [
          'Cancel',
          {
            label: 'Yes, delete it!',
            handler: () => {
              this.$store.dispatch('pickupSeries/destroy', seriesId)
            },
          },
        ],
      })
    },
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
  },
  computed: {
    ...mapGetters({
      storeId: 'stores/activeStoreId',
      pickupSeries: 'pickupSeries/all',
      oneTimePickups: 'pickups/filteredOneTime',
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
