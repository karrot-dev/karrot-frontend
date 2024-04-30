<template>
  <div
    ref="map"
    class="k-map"
  >
    <template v-if="leafletMapRef">
      <slot />
    </template>
  </div>
</template>

<script setup>
import * as L from 'leaflet'
import { debounce } from 'quasar'
import { computed, markRaw, ref, provide, watchEffect, onMounted } from 'vue'

import 'leaflet.markercluster'
import 'leaflet.markercluster/dist/MarkerCluster.css'
import 'leaflet.markercluster/dist/MarkerCluster.Default.css'

const url = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'

const props = defineProps({
  showAttribution: {
    type: Boolean,
    default: true,
  },
  bounds: {
    type: Object,
    default: null,
  },
  center: {
    type: Object,
    default: null,
  },
  zoom: {
    type: Number,
    default: 15,
  },
  paddingTopLeft: {
    type: Array,
    default: null,
  },
  scrollWheelZoom: {
    type: Boolean,
    default: true,
  },
  cluster: {
    type: Boolean,
    default: false,
  },
})

const map = ref(null)
const leafletMapRef = ref(null)
const leafletMarkerClusterGroupRef = ref(null)

if (props.cluster) {
  provide('leafletLayer', leafletMarkerClusterGroupRef)
}
else {
  provide('leafletLayer', leafletMapRef)
}

const emit = defineEmits([
  'contextmenu',
  'moveend',
  'update:zoom',
  'map-click',
])

const attribution = computed(() => {
  if (props.showAttribution) {
    return '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }
  return ''
})

watchEffect(() => setMapOptions(leafletMapRef.value))

onMounted(() => {
  const leafletMap = L.map(map.value, { scrollWheelZoom: props.scrollWheelZoom })

  if (props.cluster) {
    const clusterGroup = markRaw(L.markerClusterGroup({
      zoomToBoundsOnClick: false,
    }))

    // Override the default version of zoomToBoundsOnClick to add the padding
    clusterGroup.on('clusterclick', event => {
      event.layer.zoomToBounds({ paddingTopLeft: props.paddingTopLeft })
    })
    leafletMap.addLayer(clusterGroup)
    leafletMarkerClusterGroupRef.value = clusterGroup
  }

  L.tileLayer(url, {
    maxZoom: 19,
    attribution: attribution.value,
  }).addTo(leafletMap)

  leafletMap.on('moveend', debounce(event => {
    emit('moveend', event)
    emit('update:zoom', leafletMap.getZoom())
  }), 100)

  leafletMap.on('click', ({ latlng }) => {
    // sometimes latlng is undefined, let's skip those pointless events...
    if (!latlng) return
    emit('map-click', latlng)
  })

  leafletMap.on('contextmenu', event => {
    emit('contextmenu', event)
  })

  leafletMap.on('zoom', () => {
    leafletMap.closePopup()
  })

  setMapOptions(leafletMap)

  leafletMap.whenReady(() => {
    leafletMapRef.value = markRaw(leafletMap)
  })
})

function setMapOptions (leafletMap) {
  if (!leafletMap) return

  leafletMap.closePopup()
  if (props.bounds) {
    leafletMap.fitBounds(props.bounds, { paddingTopLeft: props.paddingTopLeft })
  }
  else {
    if (props.paddingTopLeft) {
      console.warn('paddingTopLeft ignored as no bounds set')
    }
    leafletMap.setView(props.center, props.zoom)
  }
}
</script>

<style src="leaflet/dist/leaflet.css"></style>

<style lang="sass">
.k-map
  height: 100%
  .vector-marker
    position: absolute
    bottom: 0
    left: -15px
    width: 30px
    text-align: center

    svg
      vertical-align: bottom

      path
        stroke: black
        stroke-opacity: .1
        stroke-width: 1

    i
      position: absolute
      top: 9px
      left: 0
      width: 30px
      font-size: 14px
      color: white

  .vector-marker-shadow
    position: absolute
    bottom: 0px
    left: -7px
    width: 12px
    filter: blur(2px)
    opacity: .3
    transform: rotate(20deg) skew(-30deg)
    transform-origin: 50% bottom

    svg
      vertical-align: bottom
</style>
