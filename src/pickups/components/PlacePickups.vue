<template>
  <div>
    <KNotice v-if="isInactive">
      <template slot="icon">
        <i class="far fa-handshake" />
      </template>
      {{ $t('STOREDETAIL.INACTIVE') }}
      <RouterLink
        v-if="isEditor"
        slot="desc"
        :to="{name: 'placeEdit', params: { placeId }}"
      >
        {{ $t('STOREDETAIL.CHANGE_STATUS') }}
      </RouterLink>
    </KNotice>
    <KNotice v-else-if="hasNoPickups">
      <template slot="icon">
        <i class="fas fa-bed" />
      </template>
      {{ $t('PICKUPLIST.NONE') }}
      <RouterLink
        v-if="isEditor"
        slot="desc"
        :to="{name: 'placePickupsManage', params: { placeId }}"
      >
        {{ $t('PICKUPLIST.STORE_NONE_HINT') }}
      </RouterLink>
    </KNotice>
    <PickupList
      :pending="fetchPending"
      :pickups="pickups"
      @join="join"
      @leave="leave"
      @detail="detail"
    />
  </div>
</template>

<script>
import PickupList from '@/pickups/components/PickupList'
import KNotice from '@/utils/components/KNotice'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: {
    PickupList,
    KNotice,
  },
  computed: {
    ...mapGetters({
      placeId: 'places/activePlaceId',
      place: 'places/activePlace',
      pickups: 'pickups/byActivePlace',
      fetchPending: 'pickups/fetchingForCurrentGroup',
      isEditor: 'currentGroup/isEditor',
    }),
    hasNoPickups () {
      if (this.fetchPending) return false
      return this.pickups && this.pickups.length === 0
    },
    isInactive () {
      return this.place && this.place.status !== 'active'
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
