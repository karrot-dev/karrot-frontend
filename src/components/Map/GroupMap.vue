<template>
  <div>
    <!--div v-for="(marker, idx) in markers">
      lat-lng: {{marker.latLng}}
      icon {{marker.icon}}
    </div>-->
    <v-map :zoom="zoom" :bounds="bounds" :center="center">
      <v-tile-layer :url="url" :attribution="attribution"></v-tile-layer>
      <v-marker v-for="marker in storeMarkers" :key="marker.id" :lat-lng="marker.latLng" :icon="marker.icon">
        <v-popup :content="marker.popupcontent"></v-popup>
      </v-marker>
      <v-marker v-for="marker in userMarkers" :key="marker.id" :lat-lng="marker.latLng" :icon="marker.icon">
        <v-popup :content="marker.popupcontent"></v-popup>
      </v-marker>
    </v-map>
  </div>
</template>

<script>
import {
  Map as VMap,
  TileLayer as VTileLayer,
  Marker as VMarker,
  Popup as VPopup,
} from 'vue2-leaflet'

import L from 'leaflet'
import 'leaflet.awesome-markers/dist/leaflet.awesome-markers.js'

// fix default marker icon. Should hopefully get fixed in Leaflet 1.3
// https://github.com/Leaflet/Leaflet/issues/4968
delete L.Icon.Default.prototype._getIconUrl
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
})

export default {
  components: {
    VMap, VTileLayer, VMarker, VPopup,
  },
  data () {
    return {
      zoom: 13,
      center: L.latLng(49.9105778076202, 8.65834236145019),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
    }
  },
  props: {
    users: { required: false, default: () => [] },
    stores: { required: false, default: () => [] },
    showUsers: { required: false, default: true },
    showStores: { required: false, default: true },
  },
  computed: {
    storeMarkers () {
      if (!this.showStores) return []
      return this.stores.filter(hasLocation).map(store => {
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
      })
    },
    userMarkers () {
      if (!this.showUsers) return []
      return this.users.filter(hasLocation).map(user => {
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
      })
    },
    bounds () {
      let markers = [...this.storeMarkers]
      if (markers.length === 0) {
        markers = [...this.storeMarkers, ...this.userMarkers]
      }
      if (markers.length > 0) {
        return L.latLngBounds(markers.map(m => m.latLng)).pad(0.2)
      }
      else {
        return L.latLngBounds()
      }
    },
  },
}

function hasLocation (item) {
  return item.latitude && item.longitude
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.awesome-markers/dist/leaflet.awesome-markers.css";

</style>
