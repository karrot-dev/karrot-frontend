<template>
  <v-map ref="map" :bounds="bounds" :maxZoom="15">
    <v-tile-layer :url="url" :attribution="attribution"></v-tile-layer>
    <v-marker v-for="marker in markers" :key="marker.id" v-bind="marker" @l-dragend="$emit('markerMoved', $event.target._latlng, marker)" :opacity="opacityFor(marker)">
      <v-popup v-if="marker.popupcontent" :content="marker.popupcontent"></v-popup>
    </v-marker>
  </v-map>
</template>

<script>
import {
  Map as VMap,
  TileLayer as VTileLayer,
  Popup as VPopup,
} from 'vue2-leaflet'

import ExtendedMarker from './ExtendedMarker.vue'

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

const SELECTED_OPACITY = 1
const UNSELECTED_OPACITY = 0.5

export default {
  components: {
    VMap, VTileLayer, VMarker: ExtendedMarker, VPopup,
  },
  props: {
    markers: {
      required: true,
      type: Array,
    },
    selectedMarkerIds: {
      required: false,
      default: () => [],
    },
    showAttribution: {
      default: true,
    },
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    }
  },
  methods: {
    opacityFor (marker) {
      if (!this.hasSelectedMarkers) return SELECTED_OPACITY
      return this.selectedMarkerIds.includes(marker.id) ? SELECTED_OPACITY : UNSELECTED_OPACITY
    },
    getMarker (id) {
      return this.markers.find(marker => marker.id === id)
    },
  },
  computed: {
    hasSelectedMarkers () {
      return this.selectedMarkerIds.length > 0
    },
    attribution () {
      if (this.showAttribution) {
        return '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }
      else {
        return ''
      }
    },
    selectedMarkers () {
      if (this.hasSelectedMarkers) {
        return this.selectedMarkerIds.map(this.getMarker).filter(existsFilter)
      }
      else {
        return this.markers
      }
    },
    bounds () {
      if (this.selectedMarkers.length > 0) {
        return L.latLngBounds(this.selectedMarkers.map(m => m.latLng)).pad(0.2)
      }
      else {
        return L.latLngBounds([{ lat: '49.8990022441358', lng: '8.66415739059448' }])
      }
    },
  },
}

function existsFilter (val) {
  return !!val
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";
@import "~leaflet.awesome-markers/dist/leaflet.awesome-markers.css";
</style>
