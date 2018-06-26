<template>
  <div class="container">
    <StandardMap
      :markers="markers"
      :selected-markers="selectedMarkers"
      :style="style"
      :default-center="center"
      :force-center="forceCenter"
      :force-zoom="forceZoom"
      @mapMoveEnd="mapMoveEnd"
      @mapClick="openClickDialog"
    />
    <GroupMapControls
      v-if="enableControls"
      :show-users="showUsers"
      :show-stores="showStores"
      @toggleUsers="$emit('toggleUsers')"
      @toggleStores="$emit('toggleStores')"
    />
    <div
      v-if="showOverlay"
      class="overlay row justify-center content-center"
    >
      <router-link
        v-if="showStoreLocationPrompt"
        :to="{ name: 'storeEdit', params: { storeId: this.selectedStore && this.selectedStore.id } }"
      >
        <q-btn color="primary">
          {{ $t('GROUPMAP.SET_LOCATION') }}
        </q-btn>
      </router-link>
      <router-link
        v-else
        :to="{ name: 'groupEdit', params: { groupId: currentGroup && currentGroup.id, storeId: this.selectedStore && this.selectedStore.id } }"
      >
        <q-btn color="primary">
          {{ $t('GROUPMAP.SET_LOCATION') }}
        </q-btn>
      </router-link>
    </div>
  </div>
</template>

<script>

import StandardMap from '@/components/Map/StandardMap'
import GroupMapControls from '@/components/Map/GroupMapControls'
import { Dialog, QBtn } from 'quasar'

import { storeMarker, userMarker } from '@/components/Map/markers'

export default {
  components: { StandardMap, QBtn, GroupMapControls },
  props: {
    users: { required: true, type: Array },
    stores: { required: true, type: Array },
    selectedStore: { default: null, type: Object },
    showUsers: { default: false, type: Boolean },
    showStores: { default: true, type: Boolean },
    currentGroup: { type: Object, default: () => ({}) },
    forceCenter: { type: Object, default: null },
    forceZoom: { type: Number, default: null },
    enableControls: { type: Boolean, default: false },
  },
  methods: {
    openClickDialog (latLng) {
      Dialog.create({
        title: 'Create new store',
        message: 'Create a new store at this location?',
        cancel: this.$t('BUTTON.CANCEL'),
      })
        .then(() => this.$router.push({ name: 'storeCreate', query: latLng }))
        .catch(() => {})
    },
    mapMoveEnd (target) {
      this.$emit('mapMoveEnd', target)
    },
  },
  computed: {
    showStoreLocationPrompt () {
      return this.selectedStore && !(this.storesWithLocation.findIndex(e => e.id === this.selectedStore.id) >= 0)
    },
    showGroupLocationPrompt () {
      return !this.selectedStore && this.markers.length === 0 && !(this.currentGroup.latitude && this.currentGroup.longitude)
    },
    showOverlay () {
      return this.showStoreLocationPrompt || this.showGroupLocationPrompt
    },
    center () {
      const { latitude: lat, longitude: lng } = this.currentGroup
      if (lat && lng) return { lat, lng }
    },
    style () {
      return { opacity: this.showOverlay ? 0.5 : 1 }
    },
    storesWithLocation () {
      return this.stores.filter(hasLocation)
    },
    usersWithLocation () {
      return this.users.filter(hasLocation)
    },
    selectedMarkers () {
      if (this.selectedStore) {
        const markers = []
        if (hasLocation(this.selectedStore)) {
          markers.push(storeMarker(this.selectedStore))
        }
        if (this.showUsers) {
          markers.push(...this.usersWithLocation.map(userMarker))
        }
        return markers
      }
    },
    markers () {
      let items = []
      if (this.showStores) {
        items.push(...this.storesWithLocation.map(storeMarker))
      }
      if (this.showUsers) {
        items.push(...this.usersWithLocation.map(userMarker))
      }
      return items
    },
  },
}

function hasLocation (item) {
  return item.latitude && item.longitude
}
</script>

<style scoped lang="stylus">
.container
  position relative
.overlay
  top 0
  left 0
  position absolute
  width 100%
  height 100%
</style>
