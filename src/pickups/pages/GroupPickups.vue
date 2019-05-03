<template>
  <div>
    <PickupList
      :pickups="pickups"
      :pending="pending"
      place-link
      filter
      @join="join"
      @leave="leave"
      @detail="detail"
    />
    <template v-if="hasNoPickups">
      <KNotice>
        <template slot="icon">
          <i class="fas fa-bed" />
        </template>
        {{ $t('PICKUPLIST.NONE') }}
        <template slot="desc">
          {{ $t('PICKUPLIST.NONE_HINT') }}
        </template>
      </KNotice>
      <QCard>
        <QCardTitle v-t="'GROUP.STORES'" />
        <QCardMain>
          <PlaceList
            :group-id="groupId"
            :places="places"
            link-to="placePickupsManage"
          />
        </QCardMain>
      </QCard>
    </template>
  </div>
</template>

<script>
import PickupList from '@/pickups/components/PickupList'
import KNotice from '@/utils/components/KNotice'
import PlaceList from '@/places/components/PlaceList'
import { QCard, QCardTitle, QCardMain } from 'quasar'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: { QCard, QCardTitle, QCardMain, PickupList, KNotice, PlaceList },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
      pickups: 'pickups/byCurrentGroup',
      pending: 'pickups/fetchingForCurrentGroup',
      places: 'places/byCurrentGroup',
    }),
    hasNoPickups () {
      if (this.pending) return false
      return this.pickups && this.pickups.length === 0
    },
  },
  methods: {
    ...mapActions({
      join: 'pickups/join',
      leave: 'pickups/leave',
      detail: 'detail/openForPickup',
    }),
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
