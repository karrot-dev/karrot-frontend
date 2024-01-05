<template>
  <div class="hidden">
    <div
      v-if="popup"
      ref="popup"
    >
      <Component
        :is="popup.component"
        v-bind="popup.props"
      />
    </div>
  </div>
</template>

<script>

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { marker, Icon, popup } from 'leaflet/dist/leaflet-src.esm'
import { inject, markRaw } from 'vue'

import vectorIcon from '@/maps/components/vectorIcon'

// fix default marker icon
// https://github.com/Leaflet/Leaflet/issues/4968
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

export default {
  props: {
    color: {
      type: String,
      default: 'grey',
    },
    fontIcon: {
      type: String,
      default: null,
    },
    latLng: {
      type: Object,
      required: true,
    },
    draggable: {
      type: Boolean,
      default: false,
    },
    opacity: {
      type: Number,
      default: 1,
    },
    popup: {
      type: Object,
      default: null,
    },
  },
  emits: [
    'dragend',
  ],
  setup () {
    const leafletMap = inject('leafletMap')
    return { leafletMap }
  },
  data () {
    return {
      leafletMarker: null,
    }
  },
  computed: {
    icon () {
      return vectorIcon({
        fontIcon: this.fontIcon,
        color: this.color,
        popupAnchor: [2, -40],
        tooltipAnchor: [2, -40],
      })
    },
  },
  watch: {
    opacity (val) {
      if (this.leafletMarker) this.leafletMarker.setOpacity(val)
    },
    latLng (val) {
      if (this.leafletMarker) this.leafletMarker.setLatLng(val)
    },
    icon (val) {
      if (this.leafletMarker) this.leafletMarker.setIcon(val)
    },
  },
  mounted () {
    if (!this.leafletMap) {
      console.log('mounted but no leafletMap :(')
    }
    this.leafletMarker = markRaw(marker(this.latLng, {
      icon: this.icon,
      draggable: this.draggable,
    }).addTo(this.leafletMap))

    if (this.opacity) {
      this.leafletMarker.setOpacity(this.opacity)
    }
    this.leafletMarker.on('dragend', event => {
      this.$emit('dragend', event)
    })
    if (this.popup) {
      this.leafletMarker.bindPopup(popup({
        closeButton: false,
        ...this.popup,
      }).setContent(this.$refs.popup))
    }
  },
  unmounted () {
    if (this.leafletMarker) {
      this.leafletMarker.remove()
    }
  },
}
</script>
