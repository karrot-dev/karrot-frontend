<template>
  <div
    class="container"
    :style="containerStyle"
  >
    <StandardMap
      :markers="markers"
      :selected-markers="selectedMarkers"
      :style="style"
      :default-center="center"
      :force-center="forceCenter"
      :force-zoom="forceZoom"
      @mapMoveEnd="mapMoveEnd"
    >
      <QList
        v-if="currentGroup.membership.isEditor"
        slot="contextmenu"
        slot-scope="{ latLng }"
        highlight
        dense
      >
        <QItem
          :to="{name: 'storeCreate', query: latLng}"
        >
          <QItemSide
            icon="add circle"
          />
          <QItemMain
            :label="$t('CREATESTORE.TITLE')"
          />
        </QItem>
      </QList>
    </StandardMap>
    <GroupMapControls
      v-if="controls !== 'none'"
      :type="controls"
      :show-users="showUsers"
      :show-stores="showStores"
      :show-groups="showGroups"
      :show-back="false"
      :group-id="currentGroupId"
      @toggleUsers="$emit('toggleUsers')"
      @toggleStores="$emit('toggleStores')"
      @toggleGroups="$emit('toggleGroups')"
    />
    <div
      v-if="showOverlay"
      class="overlay row justify-center items-center"
    >
      <QBtn
        v-if="showUserLocationPrompt"
        color="primary"
        :to="{ name: 'settings', params: { userId: currentUser.id } }"
      >
        {{ $t('GROUPMAP.SET_LOCATION') }}
      </QBtn>
      <template v-else-if="currentGroup.membership.isEditor">
        <QBtn
          v-if="showStoreLocationPrompt"
          color="primary"
          :to="{ name: 'storeEdit', params: { groupId: currentGroup.id, storeId: currentStore && currentStore.id } }"
        >
          {{ $t('GROUPMAP.SET_LOCATION') }}
        </QBtn>
        <QBtn
          v-else-if="showGroupLocationPrompt"
          color="primary"
          :to="{ name: 'groupEdit', params: { groupId: currentGroup.id } }"
        >
          {{ $t('GROUPMAP.SET_LOCATION') }}
        </QBtn>
      </template>
    </div>
  </div>
</template>

<script>

import StandardMap from '@/maps/components/StandardMap'
import GroupMapControls from '@/maps/components/GroupMapControls'
import {
  QBtn,
  QList,
  QItem,
  QItemMain,
  QItemSide,
} from 'quasar'

import { groupMarker, storeMarker, userMarker } from '@/maps/components/markers'

export default {
  components: {
    StandardMap,
    QBtn,
    QList,
    QItem,
    QItemMain,
    QItemSide,
    GroupMapControls,
  },
  props: {
    users: { required: true, type: Array },
    stores: { required: true, type: Array },
    groups: { default: null, type: Array },
    currentStore: { default: null, type: Object },
    currentUser: { default: null, type: Object },
    showUsers: { default: false, type: Boolean },
    showStores: { default: true, type: Boolean },
    showGroups: { default: false, type: Boolean },
    createDatastore: { default: false, type: Boolean },
    currentGroup: { type: Object, default: () => ({}) },
    forceCenter: { type: Object, default: null },
    forceZoom: { type: Number, default: null },
    controls: { type: String, default: 'none' },
    height: { type: Number, default: null },
  },
  methods: {
    mapMoveEnd (target) {
      this.$emit('mapMoveEnd', target)
    },
  },
  computed: {
    showUserLocationPrompt () {
      return this.currentUser && this.currentUser.isCurrentUser && !hasLocation(this.currentUser)
    },
    showStoreLocationPrompt () {
      return this.currentStore && !(this.storesWithLocation.findIndex(e => e.id === this.currentStore.id) >= 0)
    },
    showGroupLocationPrompt () {
      return this.markers.length === 0 && !(this.currentGroup.latitude && this.currentGroup.longitude)
    },
    showOverlay () {
      if (this.currentUser && hasLocation(this.currentUser)) return false
      return this.showUserLocationPrompt || this.showStoreLocationPrompt || this.showGroupLocationPrompt
    },
    center () {
      const { latitude: lat, longitude: lng } = this.currentGroup
      if (lat && lng) return { lat, lng }
    },
    containerStyle () {
      if (this.height) {
        return { height: `${this.height}px` }
      }
      return {}
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
    groupsWithLocation () {
      return (this.groups && this.groups.filter(hasLocation)) || []
    },
    selectedMarkers () {
      if (this.currentUser) {
        if (hasLocation(this.currentUser)) {
          return [userMarker(this.currentUser)]
        }
      }
      else if (this.currentStore) {
        const markers = []
        if (hasLocation(this.currentStore)) {
          markers.push(storeMarker(this.currentStore))
        }
        if (this.showUsers) {
          markers.push(...this.usersWithLocation.map(userMarker))
        }
        if (this.showGroups) {
          markers.push(...this.groupsWithLocation.map(groupMarker))
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
      else if (this.currentUser && hasLocation(this.currentUser)) {
        items.push(userMarker(this.currentUser))
      }
      if (this.showGroups) {
        items.push(...this.groupsWithLocation.map(groupMarker))
      }

      return items
    },
    currentGroupId () {
      return this.currentGroup && this.currentGroup.id
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
