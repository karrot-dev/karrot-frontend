<template>
  <div class="userMapPreview" style="position: relative">
      <v-map :zoom="zoom" :center="center">
        <v-tile-layer :url="url" :attribution="attribution"></v-tile-layer>
        <v-marker v-for="marker in markers" :key="marker.id" :lat-lng="marker.latLng" :icon="marker.icon">
          <v-popup :content="marker.popupcontent"></v-popup>
        </v-marker>
      </v-map>
    <router-link class="overlay" :to="{name: 'map', params: {userId: user.id}}"/>
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
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      attribution: '',
    }
  },
  props: {
    user: { required: true },
  },
  computed: {
    center () {
      // L.control.zoom.remove()
      return L.latLng(this.user.latitude, this.user.longitude)
    },
    markers () {
      return [{
        latLng: L.latLng(this.user.latitude, this.user.longitude),
        id: 'user_' + this.user.id,
        icon: L.AwesomeMarkers.icon({
          icon: 'user',
          markerColor: 'green',
          prefix: 'fa',
        }),
        popupcontent: `<a href="/#/user/${this.user.id}">${this.user.displayName}</a>`,
      }]
    },
  },
}
</script>

<style lang="stylus">
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.awesome-markers/dist/leaflet.awesome-markers.css";

.userMapPreview .leaflet-top.leaflet-left
  display none
.overlay
  position absolute
  top 0
  left 0
  width 100%
  height 100%
</style>
