<template>
  <div>
    <div class="topbar">
      <h4 class="md-title">
        <i class="icon fa fa-shopping-basket" aria-hidden="true"></i>
        {{$t("GROUP.PICKUPS")}}
      </h4>
      <q-btn v-if="options.showCreate">{{$t("STOREDETAIL.MANAGE")}}</q-btn>
    </div>
    <div>
      <PickupItem v-for="pickup in pickups"
                  @join="$emit('join', arguments[0])"
                  @leave="$emit('leave', arguments[0])"
                  :pickup="pickup"
                  :key="pickup.id">
        {{ $d(pickup.date, 'dateShort') }}
      </PickupItem>
    </div>
  </div>
</template>

<script>
import { QCardTitle, QCard, QCardMain, QCardSeparator, QCardActions, QBtn, QIcon } from 'quasar'
import PickupItem from './PickupItem.vue'

export default {
  props: {
    options: {
      required: false,
      default () {
        return {
          showStore: false, // either time or store
          showCreate: true,
        }
      },
    },
    pickups: {
      required: true,
    },
  },
  components: {
    QCardTitle, QCard, QCardMain, QCardSeparator, QCardActions, QBtn, QIcon, PickupItem,
  },
}
</script>

<style scoped lang="stylus">
.topbar
  h4, q-btn
    display inline-block
    padding .3em
</style>
