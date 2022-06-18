<template>
  <div>
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
import { marker, Icon, popup } from 'leaflet/dist/leaflet-src.esm'

import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { markRaw } from 'vue'

// fix default marker icon
// https://github.com/Leaflet/Leaflet/issues/4968
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

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

export default {
  inject: ['leafletMap'],
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
  data () {
    return {
      leafletMarker: null,
    }
  },
  computed: {
    icon () {
      return {
        createIcon: (oldIcon) => {
          if (oldIcon) oldIcon.remove()
          const div = document.createElement('div')
          div.innerHTML = markerHtml(this.color)
          div.className = 'vector-marker'

          if (this.fontIcon) {
            const i = document.createElement('i')
            i.className = this.fontIcon + ' fa-fw'
            div.appendChild(i)
          }

          return div
        },
        createShadow: (oldIcon) => {
          if (oldIcon) oldIcon.remove()
          const div = document.createElement('div')
          const innerDiv = document.createElement('div')
          innerDiv.className = 'vector-marker-shadow'
          innerDiv.innerHTML = markerHtml('black')
          div.appendChild(innerDiv)
          return div
        },
        options: {
          popupAnchor: [2, -40],
          tooltipAnchor: [2, -40],
        },
      }
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
