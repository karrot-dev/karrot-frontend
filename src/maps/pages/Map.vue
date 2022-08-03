<template>
  <div class="placeholder">
    <GroupMap
      class="map"
      controls="full"
      :users="users"
      :places="places"
      :groups="groups"
      :current-group="currentGroup"
      :is-editor="isEditor"
      :force-center="center"
      :force-zoom="zoom"
      :show-users="showUsers"
      :show-places="showPlaces"
      :show-groups="showGroups"
      @map-move-end="mapMoveEnd"
      @toggle-users="toggleUsers"
      @toggle-places="togglePlaces"
      @toggle-groups="toggleGroups"
    />
  </div>
</template>

<script>
import { computed } from 'vue'

import GroupMap from '@/maps/components/GroupMap'

import { mapGetters, mapActions } from 'vuex'

import { throttle } from 'quasar'
import { useCurrentGroupService } from '@/group/services'
import { usePlaceEnricher } from '@/places/enrichers'
import { useGroupInfoService } from '@/groupInfo/services'
import { useCurrentGroupEnricher } from '@/group/enrichers'

export default {
  components: { GroupMap },
  setup () {
    const enrichPlace = usePlaceEnricher()
    const enrichGroup = useCurrentGroupEnricher()
    const {
      group,
      users,
      places,
    } = useCurrentGroupService()
    const {
      groups,
    } = useGroupInfoService()
    return {
      // TODO: do these need enriching?
      groups,
      currentGroup: computed(() => enrichGroup(group.value)),
      // TODO: given the map potentially shows a lot of stuff, perhaps a more minimal enrichment just for map?
      // TODO: might need enriched users here?
      users,
      // TODO: maybe only if enabled?
      places: computed(() => places.value.map(enrichPlace)),
    }
  },
  computed: {
    ...mapGetters({
      // places: 'places/byCurrentGroup',
      // users: 'users/byCurrentGroupMap',
      // groups: 'groups/all',
      // currentGroup: 'currentGroup/value',
      isEditor: 'currentGroup/isEditor',
      showPlaces: 'sidenavBoxes/toggle/placesOnMap',
      showUsers: 'sidenavBoxes/toggle/usersOnMap',
      showGroups: 'sidenavBoxes/toggle/groupsOnMap',
    }),
    center () {
      return { lat: Number(this.$route.query.lat), lng: Number(this.$route.query.lng) }
    },
    zoom () {
      return Number(this.$route.query.zoom)
    },
  },
  created () {
    this.mapMoveEnd = throttle(this.mapMoveEnd, 500)
  },
  methods: {
    ...mapActions({
      togglePlaces: 'sidenavBoxes/toggle/placesOnMap',
      toggleUsers: 'sidenavBoxes/toggle/usersOnMap',
      toggleGroups: 'sidenavBoxes/toggle/groupsOnMap',
    }),
    mapMoveEnd (target) {
      this.$router.replace({
        query: {
          lat: target.getCenter().lat,
          lng: target.getCenter().lng,
          zoom: target.getZoom(),
        },
      })
    },
  },
}
</script>

<style lang="sass">
.map
  width: 100%
  height: 100%

.placeholder
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
</style>
