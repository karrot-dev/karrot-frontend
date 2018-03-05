<template>
  <div
    class="column gallery-wrapper"
    :class="{'expanded': expanded}">
    <GroupGalleryMap
      class="map-fixed"
      :filtered-other-groups="otherGroupsForMap"
      :filtered-my-groups="myGroupsForMap"
      :expanded="expanded" />
    <GroupGalleryCardsLayout
      class="gallery-cards"
      :my-groups="filteredMyGroups"
      :other-groups="filteredOtherGroups"
      :show-my-groups="myGroups.length > 0"
      :is-logged-in="isLoggedIn"
      :current-group-id="currentGroupId"
      :expanded="expanded"
      @search="filterGroups"
      @showPreview="showPreview"
      @preview="$emit('preview', arguments[0])"
      @visit="$emit('visit', arguments[0])">
      <q-btn
        @click="expanded = !expanded"
        flat
        class="float-right overlay-toggle-button"
      >
        <i
          class="fa fa-2x"
          :class="{'slightly-rotated': !expanded, 'fa-angle-down': $q.platform.is.mobile, 'fa-angle-up': !$q.platform.is.mobile}"/>
        <q-tooltip>
          {{ $t(expanded ? 'BUTTON.CLOSE' : 'BUTTON.OPEN') }}
        </q-tooltip>
      </q-btn>
    </GroupGalleryCardsLayout>
  </div>
</template>

<script>
import GroupGalleryMap from './GroupGalleryMap'
import GroupGalleryCardsLayout from './GroupGalleryCardsLayout'
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
      window.scrollTo(0, 0)
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
    filteredMyGroups () {
      return this.myGroups.filter(group => {
        return group.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    filteredOtherGroups () {
      return this.otherGroups.filter(group => {
        return group.name.toLowerCase().includes(this.search.toLowerCase())
      })
    },
    myGroupsForMap () {
      if (this.openGroup !== null) {
        if (this.openGroup.isMember) {
          return [this.openGroup]
        }
        return []
      }
      return this.filteredMyGroups
    },
    otherGroupsForMap () {
      if (this.openGroup !== null) {
        if (!this.openGroup.isMember) {
          return [this.openGroup]
        }
        return []
      }
      return this.filteredOtherGroups
    },
  },
  components: { GroupGalleryCardsLayout, GroupGalleryMap, QBtn, QTooltip, StandardMap },
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
  transform rotate(-180deg)
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
