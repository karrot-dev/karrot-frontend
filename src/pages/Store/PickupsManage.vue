<template>
  <div>
    <h3>
      <i class="icon fa fa-shopping-basket" aria-hidden="true"></i>
      {{ $t('PICKUPMANAGE.SERIES') }}
    </h3>

    <q-list class="pickups" separator>
      <q-collapsible v-for="series in pickupSeries"
                     :key="series.id"
                     :label="series.dayNames.join(', ')"
                     :sublabel="$d(series.startDate, 'timeShort')"
                     icon="fa-calendar">
        <q-item v-for="pickup in series.pickups" :key="pickup.id">
          <q-item-side><i class="fa fa-calendar"></i> </q-item-side>
          <q-item-main>
            <q-item-tile label>{{ $d(pickup.date, 'dateShort') }}</q-item-tile>
          </q-item-main>
          <q-item-side right>
            <q-item-tile>
              <q-btn icon="fa-pencil" flat></q-btn>
              <q-btn icon="fa-trash" flat></q-btn>
            </q-item-tile>
          </q-item-side>
        </q-item>
      </q-collapsible>
    </q-list>

    <h3>
      <i class="icon fa fa-shopping-basket" aria-hidden="true"></i>
      {{ $t('PICKUPMANAGE.SINGLE') }}
    </h3>

    <q-list class="pickups" separator>
      <q-item v-for="pickup in oneTimePickups">
        <q-item-side icon="fa-calendar" />
        <q-item-main
        :key="pickup.id"
        :label="$d(pickup.date, 'dateShort')"
        :sublabel="$d(pickup.date, 'timeShort')"
        icon="fa-calendar"></q-item-main>
      </q-item>
    </q-list>

  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import {
  QCard, QCardMain, QCardTitle, QCardSeparator, QCardActions,
  QBtn, QIcon,
  QList, QListHeader, QItem, QItemSide, QItemMain, QItemTile, QCollapsible,
} from 'quasar'

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
  },
  computed: {
    ...mapGetters({
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
.pickups
  background-color white
</style>
