<template>
  <div>
    <h3>
      <i class="icon fa fa-shopping-basket" aria-hidden="true"></i>
      {{ $t('PICKUPMANAGE.SERIES') }}
    </h3>

    <q-card>
      <q-list class="pickups" separator no-border highlight sparse>
        <q-collapsible v-for="series in pickupSeries"
                       :key="series.id"
                       :label="series.dayNames.join(', ')"
                       :sublabel="$d(series.startDate, 'timeShort')"
                       icon="fa-calendar" sparse>

          <q-item>
            <pickup-series-edit :series="series.__unenriched"/>
          </q-item>

          <q-list no-border seperator>
            <q-list-header>Upcoming pickups in this series</q-list-header>

            <q-collapsible v-for="pickup in series.pickups"
                           :key="pickup.id"
                           :label="$d(pickup.date, 'dateShort')"
                           icon="fa-calendar">
              <pickup-edit :pickup="pickup.__unenriched"/>
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
          <pickup-edit :pickup="pickup.__unenriched"/>
        </q-collapsible>
      </q-list>
    </q-card>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  QCard, QCardMain, QCardTitle, QCardSeparator, QCardActions,
  QBtn, QIcon,
  QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile, QCollapsible, QSideLink,
  QToggle,
  QDatetime,
  QInput, QField,
} from 'quasar'
import PickupSeriesEdit from '@/components/Pickups/PickupSeriesEdit'
import PickupEdit from '@/components/Pickups/PickupEdit'

export default {
  components: {
    QCard,
    QCardMain,
    QCardTitle,
    QCardSeparator,
    QCardActions,
    QBtn,
    QIcon,
    QList,
    QListHeader,
    QItem,
    QItemSide,
    QItemMain,
    QItemTile,
    QCollapsible,
    QSideLink,
    QToggle,
    QInput,
    QDatetime,
    QField,
    PickupSeriesEdit,
    PickupEdit,
  },
  data () {
    return {
      description: 'my nice description',
    }
  },
  computed: {
    ...mapGetters({
      dayNames: 'pickupSeries/dayNames',
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
