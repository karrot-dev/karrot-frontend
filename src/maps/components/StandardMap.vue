<template>
  <KMap
    v-bind="mapProps"
    :show-attribution="showAttribution"
    :padding-top-left="paddingTopLeft"
    @moveend="event => $emit('map-move-end', event.target)"
    @update:zoom="updateZoom"
    @map-click="event => closeContextMenu() && $emit('map-click', event)"
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
import { QMenu } from 'quasar'
import KMap from './KMap'
import KMarker from './KMarker'
import { latLngBounds } from 'leaflet/dist/leaflet-src.esm'

const SELECTED_OPACITY = 1
const UNSELECTED_OPACITY = 0.5

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
  },
  emits: [
    'map-move-end',
    'marker-moved',
    'map-click',
  ],
  data () {
    return {
      lastZoom: 15,
      popoverOffset: [0, 0],
      popoverLatLng: null,
    }
  },
  computed: {
    mapProps () {
      if (this.forceZoom && this.forceCenter) {
        // This is used on the full page map view, where the params come from the URL, so we need to ignore all the markers
        return {
          zoom: this.forceZoom,
          center: this.forceCenter,
        }
      }
      if (this.forceBounds) {
        // This is used when we emphasize nearby groups
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
      return this.hasSelectedMarkers ? this.selectedMarkers : this.markers
    },
    hasSelectedMarkers () {
      return this.selectedMarkers && this.selectedMarkers.length > 0
    },
  },
  watch: {
    zoom (val) {
      if (Number.isInteger(val)) this.lastZoom = val
    },
  },
  methods: {
    openContextMenu (event) {
      console.log('StandardMap opening context menu!')
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
