<template>
  <div class="container">
    <StandardMap
      :markers="markers"
      :selected-marker-ids="selectedMarkerIds"
      :style="style"
      :default-center="center"
      :force-center="forceCenter"
      :force-zoom="forceZoom"
      @mapMoveEnd="mapMoveEnd"
    />
    <div
      v-if="showOverlay"
      class="overlay row justify-center content-center"
    >
      <router-link
        v-if="showStoreLocationPrompt"
        :to="{ name: 'storeEdit', params: { storeId: this.selectedStoreId } }"
      >
        <q-btn color="primary">
          {{ $t('GROUPMAP.SET_LOCATION') }}
        </q-btn>
      </router-link>
      <router-link
        v-else
        :to="{ name: 'groupEdit', params: { groupId: currentGroup && currentGroup.id, storeId: this.selectedStoreId } }"
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
import L from 'leaflet'
import { QBtn } from 'quasar'

export default {
  components: { StandardMap, QBtn },
  props: {
    users: { required: true, type: Array },
    stores: { required: true, type: Array },
    selectedStoreId: { default: null, type: Number },
    showUsers: { default: false, type: Boolean },
    showStores: { default: true, type: Boolean },
    currentGroup: { type: Object, default: () => ({}) },
    forceCenter: { type: Object, default: null },
    forceZoom: { type: Number, default: null },
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
        fontIcon: 'fas fa-user',
        color: 'green',
        id: this.userMarkerId(user.id),
        popupcontent: `<a href="/#/user/${user.id}">${user.displayName}</a>`,
      }
    },
    createStoreMarker (store) {
      return {
        latLng: L.latLng(store.latitude, store.longitude),
        fontIcon: 'fas fa-shopping-cart',
        color: store.ui.color,
        id: this.storeMarkerId(store.id),
        popupcontent: `<a href="/#/group/${store.group.id}/store/${store.id}">${store.name}</a>`,
      }
    },
    mapMoveEnd (target) {
      this.$emit('mapMoveEnd', target)
    },
  },
  computed: {
    showStoreLocationPrompt () {
      return this.selectedStoreId && !(this.storesWithLocation.findIndex(e => e.id === this.selectedStoreId) >= 0)
    },
    showGroupLocationPrompt () {
      return !this.selectedStoreId && this.markers.length === 0 && !(this.currentGroup.latitude && this.currentGroup.longitude)
    },
    showOverlay () {
      return this.showStoreLocationPrompt || this.showGroupLocationPrompt
    },
    center () {
      if (this.currentGroup.latitude && this.currentGroup.longitude) return this.currentGroup
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
