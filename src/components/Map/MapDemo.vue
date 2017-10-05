<template>
  <v-map :zoom="zoom" :center="center">
    <v-tile-layer :url="url" :attribution="attribution"></v-tile-layer>
    <v-marker :lat-lng="marker" :icon="redMarker">
      <v-popup :content="popupcontent"></v-popup>
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
  data () {
    return {
      zoom: 13,
      center: L.latLng(47.413220, -1.219482),
      url: 'http://{s}.tile.osm.org/{z}/{x}/{y}.png',
      attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors',
      marker: L.latLng(47.413220, -1.219482),
      redMarker: L.AwesomeMarkers.icon({
        icon: 'heart',
        markerColor: 'red',
        prefix: 'fa',
      }),
      popupcontent: '<a href="https://foodsaving.world">go there</a>',
    }
  },
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.awesome-markers/dist/leaflet.awesome-markers.css";

</style>
