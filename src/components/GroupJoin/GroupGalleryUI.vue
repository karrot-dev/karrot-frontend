<template>
  <div
    class="column gallery-wrapper"
    :class="{expanded}"
  >
    <GroupGalleryMap
      class="map-fixed"
      :filtered-my-groups="filteredMyGroupsOrPreview"
      :filtered-other-groups="filteredOtherGroupsOrPreview"
      :expanded="expanded"
    />
    <GroupGalleryCardsLayout
      class="gallery-cards"
      :filtered-my-groups="filteredMyGroupsOrPreview"
      :filtered-other-groups="filteredOtherGroupsOrPreview"
      :playground-group="playgroundGroup"
      :has-joined-groups="myGroups.length > 0"
      :group-for-preview="groupForPreview"
      :is-logged-in="isLoggedIn"
      :expanded="expanded"
      :search="search"
      :show-inactive="showInactive"
      @setShowInactive="setShowInactive"
      @search="filterGroups"
      @showPreview="showPreview"
      @preview="$emit('preview', arguments[0])"
      @visit="$emit('visit', arguments[0])"
    >
      <q-btn
        @click="expanded = !expanded"
        flat
        round
        small
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
      showInactive: false,
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
    setShowInactive (value) {
      this.showInactive = value
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
      return this.searchInName(this.search, this.myGroups)
    },
    filteredMyGroupsOrPreview () {
      if (this.previewOpened) {
        return [this.groupForPreview].filter(g => g.isMember)
      }
      return this.filteredMyGroups
    },
    filteredOtherGroups () {
      let filteredGroups = this.searchInName(this.search, this.otherGroups)
      if (!this.showInactive) {
        filteredGroups = filteredGroups.filter(g => !g.isInactive)
      }
      const hasSearchTerm = this.search !== ''
      const hidePlaygroundByDefault = group => !hasSearchTerm ? !group.isPlayground : true
      return filteredGroups.filter(hidePlaygroundByDefault)
    },
    filteredOtherGroupsOrPreview () {
      if (this.previewOpened) {
        return [this.groupForPreview].filter(g => !g.isMember)
      }
      return this.filteredOtherGroups
    },
    oneFilterResult () {
      if ((this.filteredMyGroups.length + this.filteredOtherGroups.length) === 1) {
        return this.filteredMyGroups.length > 0 ? this.filteredMyGroups[0] : this.filteredOtherGroups[0]
      }
      return null
    },
  },
  watch: {
    search () {
      this.showPreview(this.oneFilterResult)
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
    padding-bottom 3em

body.mobile
  .map-fixed
    height: 60vh
    width: 100%
    z-index: 0
  .gallery-cards
    margin-top: 0
    min-height 10vh
    padding-bottom 3em
    margin-bottom -5em
    transition all .7s
    z-index 0
  .expanded .gallery-cards
    margin-top: -60vh
    min-height 60vh

.overlay-toggle-button
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
