<template>
  <div>
    <QInput
      :value="value.address"
      clearable
      :placeholder="$t('BUTTON.SEARCH')"
      :label="label"
      :error="error"
      :error-message="errorMessage"
      @input="input"
      @keyup.esc="$refs.menu.hide()"
      @keyup.enter.prevent.stop="search"
    >
      <template v-slot:append>
        <QBtn
          v-if="value.address"
          icon="fas fa-search"
          flat
          round
          size="sm"
          @click="search"
        />
      </template>
      <template v-slot:before>
        <QIcon :name="icon" />
      </template>
      <QMenu
        ref="menu"
        fit
        no-parent-event
        square
      >
        <QList>
          <QItem
            v-for="(result, idx) in options"
            :key="idx"
            v-close-popup
            clickable
            @click="select(result)"
          >
            <QItemSection>
              <QItemLabel>
                {{ result.label }}
              </QItemLabel>
            </QItemSection>
          </QItem>
          <QItem
            v-if="options.length < 1"
          >
            <QItemSection>
              <QItemLabel>
                {{ $t('GLOBAL.SEARCH_NOT_FOUND') }}
              </QItemLabel>
            </QItemSection>
          </QItem>
        </QList>
      </QMenu>
    </QInput>
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
  QInput,
  QBtn,
  QIcon,
  QMenu,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
} from 'quasar'
import StandardMap from '@/maps/components/StandardMap'
import L from 'leaflet'

import geocoding from '@/maps/api/geocoding'

export default {
  components: {
    QInput,
    QBtn,
    QIcon,
    QMenu,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
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
  },
  methods: {
    async search () {
      const terms = this.value.address
      console.log('search', terms)
      if (!terms) {
        this.options = []
      }

      this.options = (await geocoding.lookupAddress(terms)).map(result => {
        const { address } = result
        return {
          result,
          label: address,
        }
      })
      this.$refs.menu.show()
    },
    input (value) {
      if (!value) {
        this.reset()
        return
      }
      this.$emit('input', { ...this.value, address: value })
    },
    select (value) {
      console.log('select', value)
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
      console.log('reset')
      this.$refs.menu.hide()
      this.$emit('input', { ...this.value, latitude: null, longitude: null, address: null })
    },
  },
}
</script>

<style scoped lang="stylus">
.map
  height 260px
  margin-left 42px
  margin-top -10px
  width calc(100% - 42px)
</style>
