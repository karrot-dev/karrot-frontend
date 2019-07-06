<template>
  <div>
    <QSelect
      :value="value.address"
      use-input
      clearable
      hide-selected
      fill-input
      label="label"
      :options="options"
      :hint="$t('BUTTON.SEARCH')"
      @filter="search"
      @input="select"
    >
      <template v-slot:prepend>
        <QIcon name="fas fa-search" />
      </template>
    </QSelect>
    <StandardMap
      class="map"
      :markers="marker ? [marker] : []"
      :prevent-zoom="preventZoom"
      @markerMoved="mapMarkerMoved"
      @mapClick="mapMarkerMoved"
    />
  </div>
</template>

<script>
import {
  QSelect,
  QIcon,
} from 'quasar'
import StandardMap from '@/maps/components/StandardMap'
import L from 'leaflet'

import geocoding from '@/maps/api/geocoding'

export default {
  components: {
    QSelect,
    QIcon,
    StandardMap,
  },
  props: {
    value: {
      type: Object,
      required: true,
    },
    color: {
      default: 'blue',
      type: String,
    },
    fontIcon: {
      default: null,
      type: String,
    },
  },
  data () {
    return {
      preventZoom: false,
      options: null,
    }
  },
  computed: {
    marker () {
      const { latitude, longitude } = this.value
      if (latitude && longitude) {
        return {
          latLng: L.latLng(latitude, longitude),
          fontIcon: this.fontIcon,
          color: this.color,
          draggable: true,
        }
      }
      return null
    },
  },
  watch: {
    'value.address' (val) {
      if (val === '') {
        this.reset()
      }
    },
  },
  methods: {
    async search (terms, update, abort) {
      this.$emit('input', { ...this.value, address: terms })
      if (!terms) {
        update(() => {
          this.options = []
        })
        return
      }
      update(async () => {
        this.options = (await geocoding.lookupAddress(terms)).map(result => {
          const { address } = result
          return {
            result,
            label: address,
            value: address,
          }
        })
      })
    },
    select (value) {
      if (!value) {
        this.reset()
        return
      }
      const { result: { address, latitude, longitude } } = value
      this.preventZoom = false
      this.$emit('input', { ...this.value, latitude, longitude, address })
    },
    mapMarkerMoved ({ lat: latitude, lng: longitude }) {
      this.preventZoom = true
      this.$emit('input', { ...this.value, latitude, longitude })
    },
    reset () {
      this.$emit('input', { ...this.value, latitude: null, longitude: null, address: null })
    },
  },
}
</script>

<style scoped lang="stylus">
.map
  height 260px
  margin-top 20px
</style>
