<template>
  <div
    class="column gallery-wrapper"
    :class="{expanded}"
  >
    <GroupGalleryMap
      class="map-fixed"
      :filtered-my-groups="filteredMyGroups"
      :filtered-other-groups="filteredOtherGroups"
      :expanded="expanded"
    />
    <div
      :class="{'expanded': expanded}"
      class="sidebar"
    >
      <QAlert
        v-if="!isLoggedIn"
        color="warning"
        icon="star"
        class="alert"
      >
        <i18n path="JOINGROUP.LOGOUT_MESSAGE.LOGGED_OUT">
          <RouterLink
            place="login"
            :to="{ name: 'login' }"
            class="underline"
          >
            {{ $t('JOINGROUP.LOGOUT_MESSAGE.LOG_IN') }}
          </RouterLink>
        </i18n>
      </QAlert>
      <p
        v-if="!hasJoinedGroups"
        class="text-primary header"
      >
        {{ $t('JOINGROUP.WHICHGROUP') }}
      </p>
      <div class="row items-start no-wrap">
        <div class="col">
          <QCard>
            <QSearch
              v-model="search"
              class="searchbar"
              hide-underline
            />
          </QCard>
          <QCheckbox
            v-model="showInactive"
            :label="`${$t('GROUP.SHOW_INACTIVE')} (${filteredOtherInactiveGroups.length})`"
            style="margin-left: 16px"
          />
        </div>
        <div style="margin-top: 4px">
          <QBtn
            flat
            round
            small
            class="float-right overlay-toggle-button"
            @click="expanded = !expanded"
          >
            <i
              class="fa fa-2x"
              :class="{'slightly-rotated': !expanded, 'fa-angle-down': $q.platform.is.mobile, 'fa-angle-up': !$q.platform.is.mobile}"
            />
            <QTooltip>
              {{ $t(expanded ? 'BUTTON.HIDE' : 'BUTTON.SHOW') }}
            </QTooltip>
          </QBtn>
        </div>
      </div>
      <KSpinner v-show="isPending" />
      <GroupGalleryCard
        v-if="showPlaygroundGroupAtTop"
        style="width: 100%"
        :group="playgroundGroup"
        @preview="$emit('preview', playgroundGroup.id)"
        @visit="$emit('visit', playgroundGroup.id)"
      />
      <div
        v-if="hasMyGroupsToShow"
        class="join-groups"
      >
        <p class="text-primary header">
          {{ $t('JOINGROUP.MY_GROUPS') }}
        </p>
        <GroupGalleryCards
          :groups="filteredMyGroups"
          :is-logged-in="isLoggedIn"
          @preview="$emit('preview', arguments[0])"
          @visit="$emit('visit', arguments[0])"
        />
      </div>
      <p
        v-if="hasJoinedGroups && hasOtherGroupsToShow"
        class="text-primary header"
      >
        {{ $t('JOINGROUP.WHICHGROUP') }}
      </p>
      <div v-if="hasOtherGroupsToShow">
        <GroupGalleryCards
          :groups="filteredOtherGroups"
          :is-logged-in="isLoggedIn"
          @preview="$emit('preview', arguments[0])"
        />
      </div>
      <hr
        v-if="showPlaygroundGroupAtBottom"
        style="margin: 20px 10px; border-color: #eee"
      >
      <GroupGalleryCard
        v-if="showPlaygroundGroupAtBottom"
        style="width: 100%"
        :group="playgroundGroup"
        @preview="$emit('preview', playgroundGroup.id)"
        @visit="$emit('visit', playgroundGroup.id)"
      />
    </div>
  </div>
</template>

<script>
import GroupGalleryMap from './GroupGalleryMap'
import GroupGalleryCards from './GroupGalleryCards'
import GroupGalleryCard from './GroupGalleryCard'
import KSpinner from '@/utils/components/KSpinner'

import {
  QBtn,
  QTooltip,
  QAlert,
  QSearch,
  QCard,
  QCheckbox,
} from 'quasar'

export default {
  components: {
    GroupGalleryMap,
    GroupGalleryCards,
    GroupGalleryCard,
    KSpinner,
    QBtn,
    QTooltip,
    QAlert,
    QSearch,
    QCard,
    QCheckbox,
  },
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
    fetchStatus: {
      default: null,
      type: Object,
    },
  },
  data () {
    return {
      search: '',
      expanded: true,
      showInactive: false,
    }
  },
  computed: {
    isPending () {
      return this.fetchStatus && this.fetchStatus.pending
    },
    hasJoinedGroups () {
      return this.myGroups.length > 0
    },
    filteredMyGroups () {
      return this.searchInName(this.search, this.myGroups)
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
    filteredOtherInactiveGroups () {
      return this.searchInName(this.search, this.otherGroups).filter(g => g.isInactive)
    },
    hasMyGroupsToShow () {
      return this.expanded && this.filteredMyGroups.length > 0
    },
    hasOtherGroupsToShow () {
      return this.expanded && this.filteredOtherGroups.length > 0
    },
    showPlaygroundGroupAtTopOrBottom () {
      if (this.search) return false
      if (!this.expanded) return false
      if (!this.playgroundGroup) return false
      if (this.playgroundGroup && this.playgroundGroup.isMember) return false
      return true
    },
    showPlaygroundGroupAtTop () {
      if (this.showPlaygroundGroupAtTopOrBottom) {
        if (this.isLoggedIn && !this.hasJoinedGroups) return true
        if (!this.isLoggedIn) return true
        return false
      }
      return false
    },
    showPlaygroundGroupAtBottom () {
      return this.showPlaygroundGroupAtTopOrBottom && !this.showPlaygroundGroupAtTop
    },
  },
  methods: {
    searchInName (term, list) {
      if (!term || term === '') return list
      return list.filter(group => {
        return group.name && group.name.toLowerCase().includes(term.toLowerCase())
      })
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.gallery-wrapper
  .overlay-toggle-button
    i
      transition transform .5s
      &.slightly-rotated
        transform rotate(-180deg)
  .sidebar
    width 100%
    z-index 2
    background-color rgba(255, 255, 255, 0.8)
    padding 5px
    .text-primary
      margin-left .2em
    .searchbar
      margin-top .2em
      padding 5px
    .underline
      text-decoration underline
    .header
      font-size 1.4em
      padding-top 14px
      margin-left 10px

body.desktop .gallery-wrapper
  .map-fixed
    position fixed
    height 100vh
    right 0
    left 0
    z-index 0
  .sidebar
    &.expanded
      padding-bottom 3em
    .alert
      margin 10px 8px 10px 8px
    @media screen and (min-width: $breakpoint-sm)
      max-width 42vw
      padding 0 1em 1em 1em
      box-shadow 6px 0px 5px 0px rgba(0,0,0,0.3)
      &.expanded
        min-height 100vh

body.mobile .gallery-wrapper
  .map-fixed
    height 60vh
    width 100%
    z-index 0
  .sidebar
    margin-top 0
    min-height 10vh
    padding-bottom 3em
    margin-bottom 40px
    transition all .7s
    z-index 0
    &.expanded
      margin-top -60vh
      min-height 60vh
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
