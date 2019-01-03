<template>
  <div>
    <PickupList
      :pickups="pickups"
      store-link
      @join="join"
      @leave="leave"
      @detail="detail"
    />
    <KNotice v-if="!hasPickups" >
      <template slot="icon">
        <i class="fas fa-bed"/>
      </template>
      {{ $t('PICKUPLIST.NONE') }}
      <template slot="desc">
        {{ $t('PICKUPLIST.NONE_HINT') }}
      </template>
    </KNotice>
    <QCard v-if="!hasPickups">
      <QCardTitle v-t="'GROUP.STORES'" />
      <QCardMain>
        <StoreList
          :group-id="groupId"
          :stores="stores"
          link-to="storePickupsManage"
        />
      </QCardMain>
    </QCard>
  </div>
</template>

<script>
import PickupList from '@/pickups/components/PickupList'
import KNotice from '@/utils/components/KNotice'
import StoreList from '@/stores/components/StoreList'
import { QCard, QCardTitle, QCardMain } from 'quasar'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: { QCard, QCardTitle, QCardMain, PickupList, KNotice, StoreList },
  methods: {
    ...mapActions({
      join: 'pickups/join',
      leave: 'pickups/leave',
      detail: 'detail/openForPickup',
    }),
  },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
      pickups: 'pickups/byCurrentGroup',
      stores: 'stores/byCurrentGroup',
    }),
    hasPickups () {
      return this.pickups && this.pickups.length > 0
    },
  },
}
</script>

<style scoped lang="stylus">
.padding
  padding 1em
.notice
  .icon
    margin .1em 0 0 0
  padding 2em 3em
  transform: translateZ(1px) rotate(-3deg);
  h5
    padding 0
.manage
  padding 8px
  q-btn
    display inline-block
    padding .3em
</style>
