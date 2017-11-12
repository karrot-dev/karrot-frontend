<template>
  <div class="container">
    <StandardMap :markers="markers" :selectedMarkerIds="selectedMarkerIds" :style="style" :defaultCenter="center" />
    <div v-if="showOverlay" class="overlay row justify-center content-center">
      <router-link v-if="showStoreLocationPrompt" :to="{ name: 'storeEdit', params: { storeId: this.selectedStoreId } }">
        <q-btn color="primary">
          {{ $t('GROUPMAP.SET_LOCATION') }}
        </q-btn>
      </router-link>
      <router-link v-else :to="{ name: 'groupEdit', params: { groupId: this.activeGroup.id, storeId: this.selectedStoreId } }">
        <q-btn color="primary">
          {{ $t('GROUPMAP.SET_LOCATION') }}
        </q-btn>
      </router-link>
    </div>
  </div>
</template>

<script>

import StandardMap from '@/components/Map/StandardMap'
import L from 'leaflet'
import { QBtn } from 'quasar'
import { optionsFor } from '@/services/storeStatus'

export default {
  components: { StandardMap, QBtn },
  props: {
    users: { required: true, type: Array },
    stores: { required: true, type: Array },
    selectedStoreId: { default: null },
    showUsers: { default: false },
    showStores: { default: true },
    activeGroup: { required: true },
  },
  methods: {
    userMarkerId (userId) {
      return `user_${userId}`
    },
    storeMarkerId (storeId) {
      return `store_${storeId}`
    },
    createUserMarker (user) {
      return {
        latLng: L.latLng(user.latitude, user.longitude),
        id: this.userMarkerId(user.id),
        icon: L.AwesomeMarkers.icon({
          icon: 'user',
          markerColor: 'green',
          prefix: 'fa',
        }),
        popupcontent: `<a href="/#/user/${user.id}">${user.displayName}</a>`,
      }
    },
    createStoreMarker (store) {
      return {
        latLng: L.latLng(store.latitude, store.longitude),
        id: this.storeMarkerId(store.id),
        icon: L.AwesomeMarkers.icon({
          icon: 'shopping-cart',
          markerColor: store.ui.color,
          prefix: 'fa',
        }),
        popupcontent: `<a href="/#/group/${store.group}/store/${store.id}">${store.name}</a>`,
      }
    },
  },
  computed: {
    showStoreLocationPrompt () {
      return this.selectedStoreId && !(this.storesWithLocation.findIndex(e => e.id === this.selectedStoreId) >= 0)
    },
    showGroupLocationPrompt () {
      return !this.selectedStoreId && this.markers.length === 0 && !(this.activeGroup.latitude && this.activeGroup.longitude)
    },
    showOverlay () {
      return this.showStoreLocationPrompt || this.showGroupLocationPrompt
    },
    center () {
      if (this.activeGroup.latitude && this.activeGroup.longitude) return this.activeGroup
    },
    style () {
      return { opacity: this.showOverlay ? 0.5 : 1 }
    },
    storesWithLocation () {
      return this.stores.filter(hasLocation).filter(notArchived).map(store => ({ ...store, ui: optionsFor(store) }))
    },
    usersWithLocation () {
      return this.users.filter(hasLocation)
    },
    selectedMarkerIds () {
      let ids = []
      if (this.selectedStoreId) {
        ids.push(this.storeMarkerId(this.selectedStoreId))
        if (this.showUsers) {
          ids.push(...this.usersWithLocation.map(user => user.id).map(this.userMarkerId))
        }
      }
      return ids
    },
    markers () {
      let items = []
      if (this.showStores) {
        items.push(...this.storesWithLocation.map(this.createStoreMarker))
      }
      if (this.showUsers) {
        items.push(...this.usersWithLocation.map(this.createUserMarker))
      }
      return items
    },
  },
}

function hasLocation (item) {
  return item.latitude && item.longitude
}

function notArchived (store) {
  return store.status !== 'archived'
}
</script>

<style lang="stylus">
.container
  position relative
.overlay
  top 0
  left 0
  position absolute
  width 100%
  height 100%
</style>
