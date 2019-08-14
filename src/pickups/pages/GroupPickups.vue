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
        <template v-slot:icon>
          <i class="fas fa-bed" />
        </template>
        {{ $t('PICKUPLIST.NONE') }}
        <template v-slot:desc>
          {{ $t('PICKUPLIST.NONE_HINT') }}
        </template>
      </KNotice>
      <QCard>
        <QCardSection v-t="'GROUP.PLACES'" />
        <QCardSection>
          <PlaceList
            :group-id="groupId"
            :places="places"
            link-to="placePickupsManage"
          />
        </QCardSection>
      </QCard>
    </template>
  </div>
</template>

<script>
import {
  QCard,
  QCardSection,
} from 'quasar'

import { mapGetters, mapActions } from 'vuex'

import PickupList from '@/pickups/components/PickupList'
import KNotice from '@/utils/components/KNotice'
import PlaceList from '@/places/components/PlaceList'

export default {
  components: {
    QCard,
    QCardSection,
    PickupList,
    KNotice,
    PlaceList,
  },
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
