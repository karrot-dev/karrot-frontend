<template>
  <div>
    <PickupList
      :pickups="meetings"
      :pending="pending"
      place-link
      filter
      @join="join"
      @leave="leave"
      @detail="detail"
    />
  </div>
</template>

<script>
import PickupList from '@/pickups/components/PickupList'

import {
  mapGetters,
  mapActions,
} from 'vuex'

export default {
  components: { PickupList },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
      meetings: 'meetings/byCurrentGroup',
      pending: 'meetings/fetchingForCurrentGroup',
      places: 'places/byCurrentGroup',
    }),
  },
  methods: {
    ...mapActions({
      join: 'meetings/join',
      leave: 'meetings/leave',
      detail: 'detail/openForPickup',
    }),
  },
}
</script>
