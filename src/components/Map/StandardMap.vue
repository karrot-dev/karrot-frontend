<template>
  <v-map :zoom="zoom" :bounds="bounds" :center="center">
    <v-tile-layer :url="url" :attribution="attribution"></v-tile-layer>
    <v-marker v-for="marker in markers" :key="marker.id" :lat-lng="marker.latLng" :icon="marker.icon">
      <v-popup :content="marker.popupcontent"></v-popup>
    </v-marker>
  </v-map>
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
  props: {
    markers: { required: false, default: () => [] },
    showAttribution: { default: true },
  },
  data () {
    return {
      zoom: 13,
      center: L.latLng(49.9105778076202, 8.65834236145019),
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    }
  },
  computed: {
    attribution () {
      if (this.showAttribution) {
        return '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }
      else {
        return ''
      }
    },
    bounds () {
      if (this.markers.length > 0) {
        return L.latLngBounds(this.markers.map(m => m.latLng)).pad(0.2)
      }
      else {
        return L.latLngBounds()
      }
    },
  },
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
</style>
