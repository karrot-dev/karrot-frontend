<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<template>
  <div
    ref="map"
    class="k-map"
  >
    <template v-if="leafletMap">
      <slot />
    </template>
  </div>
</template>

<script>
import { debounce } from 'quasar'
import { computed, markRaw } from 'vue'

import { map, tileLayer } from 'leaflet/dist/leaflet-src.esm'

export default {
  provide () {
    return {
      leafletMap: computed(() => this.leafletMap),
    }
  },
  props: {
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
  },
  emits: [
    'contextmenu',
    'moveend',
    'update:zoom',
    'map-click',
  ],
  data () {
    return {
      leafletMap: null,
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    }
  },
  computed: {
    attribution () {
      if (this.showAttribution) {
        return '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      }
      return ''
    },
  },
  watch: {
    bounds () {
      this.setMapOptions(this.leafletMap)
    },
    center () {
      this.setMapOptions(this.leafletMap)
    },
    zoom () {
      this.setMapOptions(this.leafletMap)
    },
    paddingTopLeft () {
      this.setMapOptions(this.leafletMap)
    },
  },
  mounted () {
    const leafletMap = map(this.$refs.map)

    tileLayer(this.url, {
      maxZoom: 19,
      attribution: this.attribution,
    }).addTo(leafletMap)

    leafletMap.on('moveend', debounce(event => {
      this.$emit('moveend', event)
      this.$emit('update:zoom', this.leafletMap.getZoom())
    }), 100)

    leafletMap.on('click', ({ latlng }) => {
      // sometimes latlng is undefined, let's skip those pointless events...
      if (!latlng) return
      this.$emit('map-click', latlng)
    })

    leafletMap.on('contextmenu', event => {
      console.log('KMap contextmenu!')
      this.$emit('contextmenu', event)
    })

    leafletMap.on('zoom', () => {
      leafletMap.closePopup()
    })

    this.setMapOptions(leafletMap)

    leafletMap.whenReady(() => {
      this.leafletMap = markRaw(leafletMap)
    })
  },
  methods: {
    setMapOptions (leafletMap) {
      if (!leafletMap) return

      leafletMap.closePopup()
      if (this.bounds) {
        leafletMap.fitBounds(this.bounds, { paddingTopLeft: this.paddingTopLeft })
      }
      else {
        if (this.paddingTopLeft) {
          console.warn('paddingTopLeft ignored as no bounds set')
        }
        leafletMap.setView(this.center, this.zoom)
      }
    },
  },
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
