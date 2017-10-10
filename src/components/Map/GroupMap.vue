<template>
  <div>
    <StandardMap :markers="markers" :selectedMarkerIds="selectedMarkerIds"/>
  </div>
</template>

<script>

import StandardMap from '@/components/Map/StandardMap'
import L from 'leaflet'

export default {
  components: { StandardMap },
  props: {
    users: { required: false, default: () => [] },
    stores: { required: false, default: () => [] },
    selectedUserId: { required: false, default: null },
    selectedStoreId: { required: false, default: null },
    showUsers: { required: false, default: false },
    showStores: { required: false, default: true },
  },
  methods: {
    userMarkerId (userId) {
      return `user_${userId}`
    },
    storeMarkerId (storeId) {
      return `store_${storeId}`
    },
    createUserMarker (user) {
      return {
        latLng: L.latLng(user.latitude, user.longitude),
        id: this.userMarkerId(user.id),
        icon: L.AwesomeMarkers.icon({
          icon: 'user',
          markerColor: 'green',
          prefix: 'fa',
        }),
        popupcontent: `<a href="/#/user/${user.id}">${user.displayName}</a>`,
      }
    },
    createStoreMarker (store) {
      return {
        latLng: L.latLng(store.latitude, store.longitude),
        id: this.storeMarkerId(store.id),
        icon: L.AwesomeMarkers.icon({
          icon: 'shopping-cart',
          markerColor: 'blue',
          prefix: 'fa',
        }),
        popupcontent: `<a href="/#/group/${store.group}/store/${store.id}">${store.name}</a>`,
      }
    },
  },
  computed: {
    selectedMarkerIds () {
      let ids = []
      if (this.selectedUserId) {
        ids.push(this.userMarkerId(this.selectedUserId))
      }
      if (this.selectedStoreId) {
        ids.push(this.storeMarkerId(this.selectedStoreId))
      }
      return ids
    },
    markers () {
      let items = []
      if (this.showStores) {
        items.push(...this.stores.filter(hasLocation).map(this.createStoreMarker))
      }
      if (this.showUsers) {
        items.push(...this.users.filter(hasLocation).map(this.createUserMarker))
      }
      return items
    },
  },
}

function hasLocation (item) {
  return item.latitude && item.longitude
}
</script>
