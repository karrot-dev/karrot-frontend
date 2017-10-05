<template>
  <div>
    <StandardMap :markers="markers"/>
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
    showUsers: { required: false, default: true },
    showStores: { required: false, default: true },
  },
  computed: {
    markers () {
      let items = []
      if (this.showStores) {
        items.push(...this.stores.filter(hasLocation).map(store => {
          return {
            latLng: L.latLng(store.latitude, store.longitude),
            id: 'store_' + store.id,
            icon: L.AwesomeMarkers.icon({
              icon: 'shopping-cart',
              markerColor: 'blue',
              prefix: 'fa',
            }),
            popupcontent: `<a href="/#/group/${store.group}/store/${store.id}">${store.name}</a>`,
          }
        }))
      }
      if (this.showUsers) {
        items.push(...this.users.filter(hasLocation).map(user => {
          return {
            latLng: L.latLng(user.latitude, user.longitude),
            id: 'user_' + user.id,
            icon: L.AwesomeMarkers.icon({
              icon: 'user',
              markerColor: 'green',
              prefix: 'fa',
            }),
            popupcontent: `<a href="/#/user/${user.id}">${user.displayName}</a>`,
          }
        }))
      }
      return items
    },
  },
}

function hasLocation (item) {
  return item.latitude && item.longitude
}
</script>
