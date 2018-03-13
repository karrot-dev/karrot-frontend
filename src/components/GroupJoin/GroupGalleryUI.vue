<template>
  <div
    class="column gallery-wrapper"
    :class="{'expanded': expanded}"
  >
    <GroupGalleryMap
      class="map-fixed"
      :filtered-my-groups="filteredMyGroups"
      :filtered-other-groups="filteredOtherGroups"
      :expanded="expanded"
    />
    <GroupGalleryCardsLayout
      class="gallery-cards"
      :filtered-my-groups="filteredMyGroups"
      :filtered-other-groups="filteredOtherGroups"
      :playground-group="playgroundGroup"
      :has-joined-groups="myGroups.length > 0"
      :group-for-preview="groupForPreview"
      :is-logged-in="isLoggedIn"
      :expanded="expanded"
      :search="search"
      @search="filterGroups"
      @showPreview="showPreview"
      @preview="$emit('preview', arguments[0])"
      @visit="$emit('visit', arguments[0])"
    >
      <q-btn
        @click="expanded = !expanded"
        flat
        class="float-right overlay-toggle-button"
      >
        <i
          class="fa fa-2x"
          :class="{'slightly-rotated': !expanded, 'fa-angle-down': $q.platform.is.mobile, 'fa-angle-up': !$q.platform.is.mobile}"
        />
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
  components: { GroupGalleryCardsLayout, GroupGalleryMap, QBtn, QTooltip, StandardMap },
  props: {
    myGroups: {
      default: () => [],
      type: Array,
    },
    otherGroups: {
      default: () => [],
      type: Array,
    },
    playgroundGroup: {
      default: undefined,
      type: Object,
    },
    isLoggedIn: {
      default: false,
      type: Boolean,
    },
  },
  data () {
    return {
      search: '',
      groupForPreview: null,
      expanded: true,
    }
  },
  methods: {
    filterGroups (term) {
      this.search = term
    },
    showPreview (group) {
      window.scrollTo(0, 0)
      this.groupForPreview = group
    },
    searchInName (term, list) {
      if (!term || term === '') return list
      return list.filter(group => {
        return group.name.toLowerCase().includes(term.toLowerCase())
      })
    },
  },
  computed: {
    filteredMyGroups () {
      if (this.previewOpened) {
        return [this.groupForPreview].filter(g => g.isMember)
      }
      return this.searchInName(this.search, this.myGroups)
    },
    filteredOtherGroups () {
      if (this.previewOpened) {
        return [this.groupForPreview].filter(g => !g.isMember)
      }
      const filteredGroups = this.searchInName(this.search, this.otherGroups)
      const hasSearchTerm = this.search !== ''
      const hidePlaygroundByDefault = group => !hasSearchTerm ? !group.isPlayground : true
      return filteredGroups.filter(hidePlaygroundByDefault)
    },
  },
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
