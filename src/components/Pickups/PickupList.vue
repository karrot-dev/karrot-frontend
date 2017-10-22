<template>
  <div>
    <div class="topbar">
      <router-link v-if="options.showCreate" :to="{ name: 'storePickupsManage', params: { storeId: store.id } }">
        <q-btn style="background-color: white">
          <i class="fa fa-clock-o on-left"/>
          {{$t("STOREDETAIL.MANAGE")}}
        </q-btn>
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
  padding 8px
  q-btn
    display inline-block
    padding .3em
</style>
