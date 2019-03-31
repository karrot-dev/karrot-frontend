<template>
  <div>
    <QSearch
      v-model="value.address"
      :placeholder="$t('BUTTON.SEARCH')"
    >
      <QAutocomplete
        @search="autocompleteSearch"
        @selected="autocompleteSelected"
      />
    </QSearch>
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
import { QSearch, QAutocomplete } from 'quasar'
import StandardMap from '@/maps/components/StandardMap'
import L from 'leaflet'

import geocoding from '@/maps/api/geocoding'

export default {
  components: { QSearch, QAutocomplete, StandardMap },
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
        this.$emit('input', { ...this.value, latitude: null, longitude: null, address: null })
      }
    },
  },
  methods: {
    async autocompleteSearch (terms, done) {
      if (!terms) done([])
      done((await geocoding.lookupAddress(terms)).map(result => {
        const { address } = result
        return {
          result,
          label: address,
          value: address,
        }
      }))
    },
    autocompleteSelected ({ result: { address, latitude, longitude } }) {
      this.preventZoom = false
      this.$emit('input', { ...this.value, latitude, longitude, address })
    },
    mapMarkerMoved ({ lat: latitude, lng: longitude }) {
      this.preventZoom = true
      this.$emit('input', { ...this.value, latitude, longitude })
    },
  },
}
</script>

<style scoped lang="stylus">
.map
  height 260px
  margin-top 20px
</style>
