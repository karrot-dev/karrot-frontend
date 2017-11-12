<template>
  <div>
    <q-search v-model="value.address" :placeholder="$t('BUTTON.SEARCH')">
      <q-autocomplete @search="autocompleteSearch" @selected="autocompleteSelected" />
    </q-search>
    <standard-map v-if="map" class="map" :markers="marker ? [marker] : []" @markerMoved="mapMarkerMoved"/>
  </div>
</template>

<script>
import { QSearch, QAutocomplete } from 'quasar'
import StandardMap from '@/components/Map/StandardMap'
import L from 'leaflet'

import geocoding from '@/services/geocoding'

export default {
  props: {
    value: {},
    map: Boolean,
  },
  components: { QSearch, QAutocomplete, StandardMap },
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
      this.$emit('input', { ...this.value, latitude, longitude, address })
    },
    mapMarkerMoved ({ lat: latitude, lng: longitude }) {
      this.$emit('input', { ...this.value, latitude, longitude })
    },
  },
  computed: {
    marker () {
      const { latitude, longitude } = this.value
      if (latitude && longitude) {
        return {
          latLng: L.latLng(latitude, longitude),
          icon: L.AwesomeMarkers.icon({
            icon: 'shopping-cart',
            markerColor: 'blue',
            prefix: 'fa',
          }),
          draggable: true,
        }
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.map
  height 260px
  margin-top 20px
</style>
