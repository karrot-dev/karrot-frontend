<template>
  <LMap
    class="k-map"
    :bounds="bounds"
    :center="center"
    :zoom="zoom"
    :min-zoom="2"
    @click="mapClick"
    @moveend="$emit('mapMoveEnd', arguments[0].target)"
    @update:zoom="updateZoom"
    @contextmenu="openContextMenu"
  >
    <LTileLayer
      :url="url"
      :attribution="attribution"
    />
    <ExtendedMarker
      v-for="marker in leafletMarkers"
      :key="marker.id"
      :lat-lng="marker.latLng"
      :icon="marker.icon"
      :color="marker.color"
      :draggable="marker.draggable"
      :opacity="opacityFor(marker)"
      @dragend="$emit('markerMoved', $event.target._latlng, marker)"
    >
      <LPopup
        v-if="marker.popup"
      >
        <Component :is="marker.popup" />
      </LPopup>
    </ExtendedMarker>
    <QPopover
      ref="popover"
      anchor="top left"
      :anchor-click="false"
      :offset="popoverOffset"
    >
      <slot
        name="contextmenu"
        :latLng="popoverLatLng"
      />
    </QPopover>
  </LMap>
</template>

<script>
import {
  LMap,
  LTileLayer,
  LPopup,
} from 'vue2-leaflet'

import ExtendedMarker from './ExtendedMarker'

import L from 'leaflet'

import {
  QPopover,
} from 'quasar'

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

function createLeafletMarker (markerOptions) {
  function markerHtml (color) {
    return `
      <svg viewBox="0 0 33 52" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink">
        <path
          d="M 16.798304,1 C 8.0719527,1 1,8.7146969 1,16.923182 1,25.134394 16.798304,51 16.798304,51 c 0,0 15.798303,-25.865606 15.798303,-34.076818 C 32.596607,8.7146969 25.520547,1 16.798304,1 Z"
          class="text-${color}"
          style="fill: currentColor"
        ></path>
      </svg>
    `
  }

  function createIcon (oldIcon) {
    if (oldIcon) oldIcon.remove()
    const div = document.createElement('div')
    div.innerHTML = markerHtml(markerOptions.color || 'grey')
    div.className = 'vector-marker'

    if (markerOptions.fontIcon) {
      const i = document.createElement('i')
      i.className = markerOptions.fontIcon + ' fa-fw'
      div.appendChild(i)
    }

    return div
  }

  function createShadow (oldIcon) {
    if (oldIcon) oldIcon.remove()
    const div = document.createElement('div')
    const innerDiv = document.createElement('div')
    innerDiv.className = 'vector-marker-shadow'
    innerDiv.innerHTML = markerHtml('black')
    div.appendChild(innerDiv)
    return div
  }

  const options = {
    popupAnchor: [2, -40],
    tooltipAnchor: [2, -40],
  }
  return {
    ...markerOptions,
    icon: { createIcon, createShadow, options },
  }
}

export default {
  components: {
    LMap,
    LTileLayer,
    ExtendedMarker,
    LPopup,
    QPopover,
  },
  props: {
    markers: {
      required: true,
      type: Array,
    },
    selectedMarkers: {
      type: Array,
      default: () => [],
    },
    showAttribution: {
      type: Boolean,
      default: true,
    },
    defaultCenter: {
      type: Object,
      default: null,
    },
    preventZoom: {
      type: Boolean,
      default: false,
    },
    forceCenter: {
      type: Object,
      default: null,
    },
    forceZoom: {
      type: Number,
      default: null,
    },
  },
  data () {
    return {
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      lastZoom: 15,
      popoverOffset: [0, 0],
      popoverLatLng: null,
    }
  },
  computed: {
    leafletMarkers () {
      return this.markers.map(createLeafletMarker)
    },
    hasSelectedMarkers () {
      return this.selectedMarkers && this.selectedMarkers.length > 0
    },
    hasMarkers () {
      return this.markers && this.markers.length > 0
    },
    hasOneMarker () {
      return this.markers && this.markers.length === 1
    },
    markersForBound () {
      if (this.hasSelectedMarkers) {
        return this.selectedMarkers
      }
      return this.markers
    },
    attribution () {
      if (this.showAttribution) {
        return '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }
      return ''
    },
    bounds () {
      if (this.forceCenter && !Number.isNaN(this.forceCenter.lat)) return null
      if (!this.preventZoom && this.hasMarkers && !this.hasOneMarker) {
        return L.latLngBounds(this.markersForBound.map(m => m.latLng)).pad(0.2)
      }
      return undefined
    },
    center () {
      if (this.forceCenter && !Number.isNaN(this.forceCenter.lat)) return this.forceCenter
      if (!this.bounds) {
        if (this.hasOneMarker) {
          return this.markersForBound[0].latLng
        }
        if (this.defaultCenter) {
          return this.defaultCenter
        }
        return ['49.8990022441358', '8.66415739059448']
      }
      return undefined
    },
    zoom () {
      if (Number.isInteger(this.forceZoom)) {
        return this.forceZoom
      }
      if (!this.preventZoom && !this.bounds) {
        if (this.defaultCenter) {
          return 10
        }
        return 15
      }
      if (!this.bounds) {
        return this.lastZoom
      }
      return undefined
    },
  },
  watch: {
    zoom (val) {
      if (Number.isInteger(val)) this.lastZoom = val
    },
  },
  methods: {
    mapClick ({ latlng }) {
      this.$emit('mapClick', latlng)
      this.closeContextMenu()
    },
    openContextMenu (event) {
      this.closeContextMenu()
      const { x, y } = event.containerPoint
      this.popoverOffset = [-x, -y]
      this.popoverLatLng = event.latlng
      this.$refs.popover.show()
    },
    closeContextMenu () {
      this.$refs.popover.hide()
    },
    updateZoom (val) {
      if (Number.isInteger(val)) this.lastZoom = val
    },
    opacityFor (marker) {
      if (!this.hasSelectedMarkers) return SELECTED_OPACITY
      return this.selectedMarkers.find(m => m.id === marker.id) ? SELECTED_OPACITY : UNSELECTED_OPACITY
    },
  },
}
</script>

<style>
@import "~leaflet/dist/leaflet.css";
</style>

<style lang="stylus">
.k-map
  .vector-marker
    width 30px
    position absolute
    bottom 0
    left -15px
    text-align center
    svg
      vertical-align bottom
      path
        stroke black
        stroke-opacity .1
        stroke-width 1
    i
      width 30px
      position absolute
      top 9px
      left 0
      color white
      font-size 14px

  .vector-marker-shadow
    width 12px
    position absolute
    bottom 0px
    left -7px
    opacity .3
    transform rotate(20deg) skew(-30deg)
    transform-origin 50% bottom
    filter blur(2px)
    svg
      vertical-align bottom
</style>
