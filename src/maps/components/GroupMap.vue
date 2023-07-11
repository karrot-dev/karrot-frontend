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
      @map-move-end="mapMoveEnd"
    >
      <template
        v-if="isEditor"
        #contextmenu="{ latLng }"
      >
        <QList
          dense
        >
          <QItem
            :to="{name: 'placeCreate', query: latLng}"
          >
            <QItemSection side>
              <QIcon name="add circle" />
            </QItemSection>
            <QItemSection>
              <QItemLabel>{{ $t('CREATESTORE.TITLE') }}</QItemLabel>
            </QItemSection>
          </QItem>
        </QList>
      </template>
    </StandardMap>
    <GroupMapControls
      v-if="controls !== 'none'"
      :type="controls"
      :hide-groups-button="hideGroups"
      @export="exportMarkers"
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
import {
  QBtn,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QIcon,
} from 'quasar'
import { computed } from 'vue'

import { useAuthHelpers } from '@/authuser/helpers'
import { useCurrentGroupService } from '@/group/services'
import { useGroupInfoService } from '@/groupInfo/services'
import { useMapToggles } from '@/maps/services'
import { useActivePlaceService } from '@/places/services'
import { useActiveUserService } from '@/users/services'

import GroupMapControls from '@/maps/components/GroupMapControls.vue'
import StandardMap from '@/maps/components/StandardMap.vue'
import { groupMarker, placeMarker, userMarker } from '@/maps/components/markers'

export default {
  components: {
    StandardMap,
    QBtn,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QIcon,
    GroupMapControls,
  },
  props: {
    forceCenter: { type: Object, default: null },
    forceZoom: { type: Number, default: null },
    controls: { type: String, default: 'none' },
    height: { type: Number, default: null },
    hideGroups: { type: Boolean, default: false },
  },
  emits: [
    'map-move-end',
  ],
  setup (props) {
    const { getIsCurrentUser } = useAuthHelpers()
    const {
      group: currentGroup,
      users,
      places,
      isEditor,
    } = useCurrentGroupService()

    const {
      groups,
    } = useGroupInfoService()

    const {
      place: selectedPlace,
    } = useActivePlaceService()

    const {
      user: selectedUser,
    } = useActiveUserService()

    const {
      showPlaces,
      showUsers,
      showGroups,
    } = useMapToggles()

    return {
      showPlaces,
      showUsers,
      showGroups: computed(() => showGroups.value && !props.hideGroups),
      selectedPlace,
      selectedUser,
      isEditor,
      groups,
      currentGroup,
      users,
      places,
      getIsCurrentUser,
    }
  },
  computed: {
    showUserLocationPrompt () {
      return this.selectedUser && this.getIsCurrentUser(this.selectedUser) && !hasLocation(this.selectedUser)
    },
    showPlaceLocationPrompt () {
      return this.selectedPlace && !(this.placesWithLocation.findIndex(e => e.id === this.selectedPlace.id) >= 0)
    },
    showGroupLocationPrompt () {
      if (!this.currentGroup) return
      return this.markers.length === 0 && !hasLocation(this.currentGroup)
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
      return this.places.filter(place => place.status === 'active').filter(hasLocation)
    },
    usersWithLocation () {
      return this.users.filter(hasLocation)
    },
    activeGroupsWithLocation () {
      return (this.groups && this.groups.filter(hasLocation).filter(group => group.status !== 'inactive')) || []
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
          markers.push(...this.activeGroupsWithLocation.map(groupMarker))
        }
        return markers
      }
      return undefined
    },
    markers () {
      const items = []
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
        items.push(...this.activeGroupsWithLocation.map(groupMarker))
      }

      return items
    },
    currentGroupId () {
      return this.currentGroup?.id
    },
  },
  methods: {
    mapMoveEnd (target) {
      this.$emit('map-move-end', target)
    },
    async exportMarkers () {
      // async import so we don't load the dependencies until we need to...
      const { exportAsGPX } = await import('@/maps/export')
      exportAsGPX(this.markers, 'markers.gpx')
    },
  },
}

function hasLocation (item) {
  return item.latitude && item.longitude
}
</script>

<style scoped lang="sass">
.container
  position: relative

.overlay
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
</style>
