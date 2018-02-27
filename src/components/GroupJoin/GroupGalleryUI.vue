<template>
  <div
    class="column gallery-wrapper"
    :class="{'expanded': expanded}">
    <GroupGalleryMap
      class="map-fixed"
      :filtered-groups="groupsForMap"
      :my-groups="myGroups"
      :expanded="expanded" />
    <GroupGalleryCards
      class="gallery-cards"
      :my-groups="myGroups"
      :other-groups="filteredGroups"
      :show-other-groups="otherGroups.length > 0"
      :is-logged-in="isLoggedIn"
      :current-group-id="currentGroupId"
      :expanded="expanded"
      @search="filterGroups"
      @showPreview="showPreview">
      <q-btn
        @click="expanded = !expanded"
        flat
        class="float-right overlay-toggle-button"
      >
        <i
          class="fa fa-2x"
          :class="{'slightly-rotated': !expanded && $q.platform.is.desktop, 'fa-map': $q.platform.is.mobile, 'fa-close': !$q.platform.is.mobile}"/>
        <q-tooltip>
          {{ $t(expanded ? 'BUTTON.CLOSE' : 'BUTTON.OPEN') }}
        </q-tooltip>
      </q-btn>
    </GroupGalleryCards>
  </div>
</template>

<script>
import GroupGalleryMap from './GroupGalleryMap'
import GroupGalleryCards from './GroupGalleryCardsUI'
import StandardMap from '@/components/Map/StandardMap'
import { QBtn, QTooltip } from 'quasar'

export default {
  data () {
    return {
      search: '',
      openGroup: null,
      expanded: true,
    }
  },
  methods: {
    filterGroups (term) {
      this.search = term
    },
    showPreview (group) {
      this.openGroup = group
    },
  },
  props: {
    myGroups: {
      default: () => [],
      type: Array,
    },
    otherGroups: {
      required: true,
      type: Array,
    },
    isLoggedIn: {
      required: true,
      type: Boolean,
    },
    currentGroupId: {
      default: -1,
      type: Number,
    },
  },
  computed: {
    filteredGroups () {
      return this.otherGroups.filter(group => {
        return group.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    groupsForMap () {
      if (this.openGroup !== null) {
        return [this.openGroup]
      }
      return this.filteredGroups
    },
  },
  components: { GroupGalleryCards, GroupGalleryMap, QBtn, QTooltip, StandardMap },
}
</script>

<style scoped lang="stylus">
@import '~variables'
body.desktop
  .map-fixed
    position: fixed
    height: 100vh
    right: 0
    left: 0
    z-index 0
  .gallery-cards
    width 100%
    margin-bottom 50vh
    @media screen and (min-width: $breakpoint-sm)
      max-width 42vw
  .expanded .gallery-cards
    margin-bottom -10em

body.mobile
  .map-fixed
    height: 60vh
    width: 100%
    z-index: 0
  .gallery-cards
    margin-top: 0
    min-height 10vh
    padding-bottom 10em
    margin-bottom -5em
    transition all .7s
    z-index 0
  .expanded .gallery-cards
    margin-top: -60vh
    min-height 60vh

.overlay-toggle-button
  margin: 20px
  i
    transition transform .5s
.slightly-rotated
  transform rotate(45deg)
</style>

<style lang="stylus">
@import '~variables'

body.mobile .gallery-wrapper.expanded .map-fixed .leaflet-control-container .leaflet-left
  display none

@media screen and (max-width: $breakpoint-sm)
  body.desktop .gallery-wrapper .map-fixed .leaflet-control-container .leaflet-left
    display none

@media screen and (min-width: $breakpoint-sm)
  body.desktop .gallery-wrapper .map-fixed .leaflet-control-container .leaflet-left
    left 42vw
</style>
