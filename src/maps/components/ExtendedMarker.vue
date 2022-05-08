<template>
  <LMarker
    v-bind="$attrs"
    @ready="ready"
  >
    <slot />
  </LMarker>
</template>

<script>
import { LMarker } from '@vue-leaflet/vue-leaflet'

export default {
  name: 'ExtendedMarker',
  components: {
    LMarker,
  },
  props: {
    opacity: {
      type: Number,
      default: 1,
    },
  },
  data () {
    return {
      leafletObject: null,
    }
  },
  watch: {
    opacity (val) {
      if (!this.leafletObject) return
      this.leafletObject.setOpacity(val)
    },
  },
  methods: {
    ready (leafletObject) {
      this.leafletObject = leafletObject
      this.leafletObject.setOpacity(this.opacity)
    },
  },
}
</script>
