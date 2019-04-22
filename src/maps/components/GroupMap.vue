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
        v-if="isEditor"
        slot="contextmenu"
        slot-scope="{ latLng }"
        highlight
        dense
      >
        <QItem
          :to="{name: 'placeCreate', query: latLng}"
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
      :show-places="showPlaces"
      :show-groups="showGroups"
      :show-back="false"
      :group-id="currentGroupId"
      @toggleUsers="$emit('toggleUsers')"
      @togglePlaces="$emit('togglePlaces')"
      @toggleGroups="$emit('toggleGroups')"
    />
    <div
      v-if="showOverlay"
      class="overlay row justify-center items-center"
    >
      <QBtn
        v-if="showUserLocationPrompt"
        color="primary"
        :to="{ name: 'settings', params: { userId: selectedUser.id } }"
      >
        {{ $t('GROUPMAP.SET_LOCATION') }}
      </QBtn>
      <template v-else-if="isEditor">
        <QBtn
          v-if="showPlaceLocationPrompt"
          color="primary"
          :to="{ name: 'placeEdit', params: { groupId: currentGroupId, placeId: selectedPlace && selectedPlace.id } }"
        >
          {{ $t('GROUPMAP.SET_LOCATION') }}
        </QBtn>
        <QBtn
          v-else-if="showGroupLocationPrompt"
          color="primary"
          :to="{ name: 'groupEdit', params: { groupId: currentGroupId } }"
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

import { groupMarker, placeMarker, userMarker } from '@/maps/components/markers'

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
    places: { required: true, type: Array },
    groups: { default: null, type: Array },
    selectedPlace: { default: null, type: Object },
    selectedUser: { default: null, type: Object },
    showUsers: { default: false, type: Boolean },
    showPlaces: { default: true, type: Boolean },
    showGroups: { default: false, type: Boolean },
    createDatastore: { default: false, type: Boolean },
    currentGroup: { type: Object, default: null },
    isEditor: { type: Boolean, default: false },
    forceCenter: { type: Object, default: null },
    forceZoom: { type: Number, default: null },
    controls: { type: String, default: 'none' },
    height: { type: Number, default: null },
  },
  computed: {
    showUserLocationPrompt () {
      return this.selectedUser && this.selectedUser.isCurrentUser && !hasLocation(this.selectedUser)
    },
    showPlaceLocationPrompt () {
      return this.selectedPlace && !(this.placesWithLocation.findIndex(e => e.id === this.selectedPlace.id) >= 0)
    },
    showGroupLocationPrompt () {
      if (!this.currentGroup) return
      return this.markers.length === 0 && !this.currentGroup.hasLocation
    },
    showOverlay () {
      if (this.selectedUser && hasLocation(this.selectedUser)) return false
      return this.showUserLocationPrompt || this.showPlaceLocationPrompt || this.showGroupLocationPrompt
    },
    center () {
      const { latitude: lat, longitude: lng } = this.currentGroup || {}
      if (lat && lng) return { lat, lng }
      return undefined
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
    placesWithLocation () {
      return this.places.filter(hasLocation)
    },
    usersWithLocation () {
      return this.users.filter(hasLocation)
    },
    groupsWithLocation () {
      return (this.groups && this.groups.filter(hasLocation)) || []
    },
    selectedMarkers () {
      if (this.selectedUser) {
        if (hasLocation(this.selectedUser)) {
          return [userMarker(this.selectedUser)]
        }
      }
      else if (this.selectedPlace) {
        const markers = []
        if (hasLocation(this.selectedPlace)) {
          markers.push(placeMarker(this.selectedPlace))
        }
        if (this.showUsers) {
          markers.push(...this.usersWithLocation.map(userMarker))
        }
        if (this.showGroups) {
          markers.push(...this.groupsWithLocation.map(groupMarker))
        }
        return markers
      }
      return undefined
    },
    markers () {
      let items = []
      if (this.showPlaces) {
        items.push(...this.placesWithLocation.map(placeMarker))
      }
      if (this.showUsers) {
        items.push(...this.usersWithLocation.map(userMarker))
      }
      else if (this.selectedUser && hasLocation(this.selectedUser)) {
        items.push(userMarker(this.selectedUser))
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
  methods: {
    mapMoveEnd (target) {
      this.$emit('mapMoveEnd', target)
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
