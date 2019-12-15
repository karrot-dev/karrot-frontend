<template>
  <div>
    <QSelect
      use-input
      fill-input
      hide-dropdown-icon
      :label="label"
      :error="error"
      :error-message="errorMessage"
      :options="options"
      :placeholder="$t('BUTTON.SEARCH')"
      :value="value.address"
      :input-debounce="1000"
      @input="input"
      @filter="search"
    >
      <template #before>
        <QIcon :name="icon" />
      </template>
      <template #selected-item />
      <template #append>
        <QIcon
          v-if="hasLocation || value.address"
          name="cancel"
          class="cursor-pointer"
          @click="reset"
        />
      </template>
      <template #option="{ index, itemProps, itemEvents, opt: { label: itemLabel, useSearchTerm } }">
        <QItem
          :key="index"
          v-bind="itemProps"
          v-on="itemEvents"
        >
          <QItemSection>
            <QItemLabel v-if="useSearchTerm">
              {{ $t('ADDRESS_PICKER.SET_AS') }}
              <strong>{{ itemLabel }}</strong>
              <span v-if="hasLocation">({{ $t('ADDRESS_PICKER.KEEP_EXISTING_LOCATION') }})</span>
              <span v-else>({{ $t('ADDRESS_PICKER.CHOOSE_LOCATION') }})</span>
            </QItemLabel>
            <QItemLabel v-else>
              {{ itemLabel }}
            </QItemLabel>
          </QItemSection>
        </QItem>
        <template v-if="useSearchTerm">
          <QSeparator />
          <QItemLabel
            header
          >
            <span v-t="'GLOBAL.SEARCH_RESULTS'" />
          </QItemLabel>
          <QItem v-if="options.length === 1">
            <QItemSection>
              <QItemLabel>
                {{ $t('GLOBAL.SEARCH_NOT_FOUND') }}
              </QItemLabel>
            </QItemSection>
          </QItem>
        </template>
      </template>
    </QSelect>
    <StandardMap
      class="map"
      :markers="marker ? [marker] : []"
      :prevent-zoom="preventZoom"
      :default-center="defaultMapCenter"
      @markerMoved="mapMarkerMoved"
      @mapClick="mapMarkerMoved"
    />
  </div>
</template>

<script>
import {
  QIcon,
  QItem,
  QItemSection,
  QItemLabel,
  QSelect,
  QSeparator,
} from 'quasar'
import StandardMap from '@/maps/components/StandardMap'
import L from 'leaflet'

import geocoding from '@/maps/api/geocoding'
import { filterTruthy } from '@/utils/utils'

export default {
  components: {
    QIcon,
    QItem,
    QItemSection,
    QItemLabel,
    QSelect,
    QSeparator,
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
    label: {
      default: null,
      type: String,
    },
    error: {
      default: false,
      type: Boolean,
    },
    errorMessage: {
      default: null,
      type: String,
    },
    icon: {
      default: null,
      type: String,
    },
    defaultMapCenter: {
      default: null,
      type: Object,
    },
  },
  data () {
    return {
      preventZoom: false,
      options: [],
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
    hasLocation () {
      const { latitude, longitude } = this.value
      return Boolean(latitude && longitude)
    },
  },
  methods: {
    async search (terms, update) {
      if (!terms) return update(() => { this.options = [] })

      const searchResults = (await geocoding.lookupAddress(terms)).map(result => {
        const { address } = result
        return {
          result,
          value: address,
          label: address,
          useSearchTerm: false,
        }
      })
      update(() => {
        // A special option that allows us to select the literal search term as the address with no geocoding
        this.options = [{
          result: { address: terms },
          value: terms,
          label: terms,
          useSearchTerm: true,
          hasSearchResults: searchResults.length > 0,
        }, ...searchResults]
      })
    },
    input (value) {
      if (!value) {
        this.reset()
        return
      }
      const { result: { address, latitude, longitude } } = value
      this.preventZoom = false
      this.$emit('input', { ...this.value, ...filterTruthy({ latitude, longitude, address }) })
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
  width calc(100% - 42px)
  height 260px
  margin-top -10px
  margin-left 37px
</style>
