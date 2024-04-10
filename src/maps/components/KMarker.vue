<template>
  <div class="hidden">
    <div
      v-if="popup"
      ref="popupRef"
    >
      <Component
        :is="popup.component"
        v-bind="popup.props"
      />
    </div>
  </div>
</template>

<script setup>

import { marker, Icon, popup as createPopup } from 'leaflet'
import iconRetinaUrl from 'leaflet/dist/images/marker-icon-2x.png'
import iconUrl from 'leaflet/dist/images/marker-icon.png'
import shadowUrl from 'leaflet/dist/images/marker-shadow.png'
import { computed, inject, markRaw, onMounted, onUnmounted, ref, toRef, watch } from 'vue'

import vectorIcon from '@/maps/components/vectorIcon'

// fix default marker icon
// https://github.com/Leaflet/Leaflet/issues/4968
delete Icon.Default.prototype._getIconUrl
Icon.Default.mergeOptions({ iconRetinaUrl, iconUrl, shadowUrl })

const props = defineProps({
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
})

const emit = defineEmits([
  'dragend',
])

const leafletLayer = inject('leafletLayer')

const leafletMarker = ref(null)

const popupRef = ref(null)

const icon = computed(() => vectorIcon({
  fontIcon: props.fontIcon,
  color: props.color,
  popupAnchor: [2, -40],
  tooltipAnchor: [2, -40],
}))

const opacity = toRef(props, 'opacity')
const latLng = toRef(props, 'latLng')

watch(opacity, value => leafletMarker.value?.setOpacity(value))
watch(latLng, value => leafletMarker.value?.setLatLng(value))
watch(icon, value => leafletMarker.value?.setIcon(value))

onMounted(() => {
  if (!leafletLayer.value) {
    console.log('mounted but no leafletLayer :(')
  }
  leafletMarker.value = markRaw(marker(props.latLng, {
    icon: icon.value,
    draggable: props.draggable,
  }).addTo(leafletLayer.value))

  if (props.opacity) {
    leafletMarker.value.setOpacity(props.opacity)
  }
  leafletMarker.value.on('dragend', event => {
    emit('dragend', event)
  })
  if (props.popup) {
    leafletMarker.value.bindPopup(createPopup({
      closeButton: false,
      className: 'k-marker-popup',
      ...props.popup,
    }).setContent(popupRef.value))
  }
})

onUnmounted(() => {
  if (leafletMarker.value) {
    leafletMarker.value.remove()
  }
})

</script>
