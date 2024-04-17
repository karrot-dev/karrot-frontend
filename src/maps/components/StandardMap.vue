<template>
  <KMap
    ref="kmap"
    v-bind="mapProps"
    :show-attribution="showAttribution"
    :padding-top-left="paddingTopLeft"
    :scroll-wheel-zoom="scrollWheelZoom"
    @moveend="event => $emit('map-move-end', event.target)"
    @update:zoom="updateZoom"
    @map-click="mapClick"
    @contextmenu="openContextMenu"
  >
    <KMarker
      v-for="marker in markers"
      :key="marker.id"
      :lat-lng="marker.latLng"
      :color="marker.color"
      :font-icon="marker.fontIcon"
      :draggable="marker.draggable"
      :popup="marker.popup"
      :opacity="opacityFor(marker)"
      @dragend="event => dragend(event, marker)"
      @marker-clicked="event => handleMarkerClicked(event, marker)"
    />
    <QMenu
      ref="popover"
      anchor="top left"
      :offset="popoverOffset"
      no-parent-event
    >
      <slot
        name="contextmenu"
        :lat-lng="popoverLatLng"
      />
    </QMenu>
  </KMap>
</template>

<script>
import { latLngBounds } from 'leaflet/dist/leaflet-src.esm'
import { QMenu } from 'quasar'

import KMap from './KMap.vue'
import KMarker from './KMarker.vue'

const SELECTED_OPACITY = 1
const UNSELECTED_OPACITY = 0.7
const i = 1

export default {
  components: {
    KMap,
    KMarker,
    QMenu,
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
    forceBounds: {
      type: Object,
      default: null,
    },
    paddingTopLeft: {
      type: Array,
      default: null,
    },
    scrollWheelZoom: {
      type: Boolean,
      default: true,
    },
  },
  emits: [
    'map-move-end',
    'marker-moved',
    'map-click',
    'update:selectedMarkers',
  ],
  data () {
    return {
      lastZoom: 15,
      popoverOffset: [0, 0],
      popoverLatLng: null,
      // Create the localSelect Marker, when we click the specific marker, it would push in localSelect marker
      localSelectedMarkers: this.selectedMarkers || [],
    }
  },
  computed: {
    mapProps () {
      console.log('the times called here: ', i)
      if (this.forceZoom && this.forceCenter) {
        // This is used on the full page map view, where the params come from the URL, so we need to ignore all the markers
        console.log('here 1')
        return {
          zoom: this.forceZoom,
          center: this.forceCenter,
        }
      }
      if (this.forceBounds) {
        // This is used when we emphasize nearby groups
        console.log('here 2')
        return {
          bounds: this.forceBounds,
        }
      }
      if (!this.preventZoom && this.markersForBounds.length > 1) {
        // Normal use case to show a bunch of markers in view
        return {
          bounds: latLngBounds(this.markersForBounds.map(m => m.latLng)).pad(0.2),
        }
      }
      else if (this.markersForBounds.length === 1) {
        // With a single marker it looks better with center and zoom
        // as if using bounds it zooms is reeeeallly close
        return {
          center: this.markersForBounds[0].latLng,
          zoom: this.preventZoom ? this.lastZoom : 15,
        }
      }
      else if (this.defaultCenter) {
        // Nothing much to show, but we've been provided with a hopefully sensible default center
        return {
          center: this.defaultCenter,
          zoom: this.preventZoom ? this.lastZoom : 10,
        }
      }
      // Ok, really ran out of options here, just show somewhere ...
      return {
        center: ['49.8990022441358', '8.66415739059448'],
        zoom: this.preventZoom ? this.lastZoom : 10,
      }
    },
    markersForBounds () {
      if (this.hasSelectedMarkers) {
        console.log('Selected markers:', this.selectedMarkers) // Log the selected markers
        return this.selectedMarkers
      }
      else {
        console.log('No selected markers, showing all markers.') // Inform when no markers are selected
        return this.markers
      }
      // return this.hasSelectedMarkers ? this.selectedMarkers : this.markers
    },
    hasSelectedMarkers () {
      return this.selectedMarkers && this.selectedMarkers.length > 0
    },
  },
  watch: {
    zoom (val) {
      if (Number.isInteger(val)) this.lastZoom = val
    },
    selectedMarkers: {
      handler (newVal) {
        this.localSelectedMarkers = newVal || []
      },
      immediate: true,
      deep: true,
    },
  },
  mounted () {
    this.localSelectedMarkers = [...this.selectedMarkers]
  },
  methods: {
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
    dragend ({ target }, marker) {
      this.$emit('marker-moved', target.getLatLng(), marker)
    },
    handleMarkerClicked ({ target }, marker) {
      const isSelected = this.localSelectedMarkers.some(m => m.id === marker.id)
      if (!isSelected) {
        this.localSelectedMarkers = [marker]
        marker.click_count = 1
        this.centerAndZoom(marker.latLng, 15)
      }
      else {
        // Marker is already selected, increment click count
        marker.click_count = (marker.click_count || 0) + 1
        if (marker.click_count % 2 === 0) {
          // Even number of clicks: zoom out
          this.fitBoundsToMarkers()
        }
        else {
          // Odd number of clicks: zoom in
          this.centerAndZoom(marker.latLng, 15)
        }
      }
      this.$emit('update:selectedMarkers', this.localSelectedMarkers)
      console.log('the local select marker is, ', this.localSelectedMarkers)
      console.log('this.selectmarker is, ', this.localSelectedMarkers)
    },

    updateZoom (val) {
      console.log('in zoom level, the select marker is', this.localSelectedMarkers)
      if (Number.isInteger(val)) this.lastZoom = val
      if (this.localSelectedMarkers.length === 1) {
        this.centerAndZoom(this.localSelectedMarkers[0].latLng, val)
      }
    },
    centerAndZoom (latLng, zoomLevel) {
      // If user choose specific marker, the map would automatically centralize to the location
      const mapInstance = this.$refs.kmap.leafletMap
      if (mapInstance) {
        mapInstance.setView(latLng, zoomLevel)
      }
    },
    fitBoundsToMarkers () {
      // This function can help the map always focus on the selected marker that user choose
      const mapInstance = this.$refs.kmap.leafletMap
      if (mapInstance && this.markers.length) {
        const bounds = latLngBounds(this.markersForBounds.map(m => m.latLng)).pad(0.2)
        mapInstance.fitBounds(bounds)
      }
    },

    mapClick (event) {
      this.closeContextMenu()
      this.$emit('map-click', event)
    },
    opacityFor (marker) {
      // If user choose the specific marker, this marker would change to darker color
      if (!marker || typeof marker.id === 'undefined') {
        console.error('Invalid marker:', marker)
        return UNSELECTED_OPACITY
      }
      return this.localSelectedMarkers.some(m => m.id === marker.id) ? SELECTED_OPACITY : UNSELECTED_OPACITY
    },
  },
}
</script>
