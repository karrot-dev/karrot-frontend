<template>
  <div>
    <div class="topbar">
      <h4 class="md-title">
        <i class="icon fa fa-shopping-basket" aria-hidden="true"></i>
        {{$t("GROUP.PICKUPS")}}
      </h4>
      <router-link v-if="options.showCreate" :to="{ name: 'storePickupsManage', params: { storeId: store.id } }">
        <q-btn style="background-color: white">{{$t("STOREDETAIL.MANAGE")}}</q-btn>
      </router-link>
    </div>
    <div>
      <PickupItem
        v-for="pickup in pickups"
        :key="pickup.id"
        :pickup="pickup"
        @join="$emit('join', arguments[0])"
        @leave="$emit('leave', arguments[0])"
        >
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
    pickups: { required: true },
    store: { required: true },
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
