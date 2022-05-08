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
      :my-coordinates="myCoordinates"
      :padding-top-left="paddingTopLeft"
    />
    <div
      :class="{'expanded': expanded}"
      class="sidebar"
    >
      <QResizeObserver
        style="width: 100%"
        @resize="onResize"
      />
      <QBanner
        v-if="!isLoggedIn"
        class="q-ma-sm bg-warning text-white shadow-2"
        style="min-height: unset"
      >
        <template #avatar>
          <QIcon
            name="star"
            color="white"
            style="font-size: 24px"
          />
        </template>
        <i18n-t keypath="JOINGROUP.LOGOUT_MESSAGE.LOGGED_OUT">
          <template #login>
            <RouterLink
              :to="{ name: 'login' }"
              class="underline"
            >
              {{ $t('JOINGROUP.LOGOUT_MESSAGE.LOG_IN') }}
            </RouterLink>
          </template>
        </i18n-t>
      </QBanner>
      <p
        v-if="!hasJoinedGroups"
        class="text-primary header"
      >
        <i18n-t keypath="JOINGROUP.OR">
          <template #joinGroup>
            {{ $t('JOINGROUP.WHICHGROUP') }}
          </template>
          <template #createGroup>
            <router-link
              :to="{ name: 'groupCreate' }"
              class="underline text-lowercase"
            >
              {{ $t('GROUP.CREATE_TITLE') }}
            </router-link>
          </template>
        </i18n-t>
      </p>
      <div class="row items-start no-wrap q-mt-md">
        <div class="col">
          <QInput
            v-model="search"
            class="q-pl-sm"
            filled
            dense
            :placeholder="$q.lang.label.search"
          >
            <template #prepend>
              <QIcon name="search" />
            </template>
          </QInput>
          <QCheckbox
            v-model="showInactive"
            :label="`${$t('GROUP.SHOW_INACTIVE')} (${filteredOtherInactiveGroups.length})`"
          />
        </div>
        <div>
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
      <div
        v-if="hasMyGroupsToShow"
        class="join-groups"
      >
        <p class="text-primary header">
          {{ $t('JOINGROUP.MY_GROUPS') }}
        </p>
        <GroupGalleryCards
          :groups="filteredMyGroups"
          @preview="(...args) => $emit('preview', ...args)"
          @visit="(...args) => $emit('visit', ...args)"
        />
      </div>
      <p
        v-if="hasJoinedGroups && hasOtherGroupsToShow"
        class="text-primary header"
      >
        <i18n-t keypath="JOINGROUP.OR">
          <template #joinGroup>
            {{ $t('JOINGROUP.WHICHGROUP') }}
          </template>
          <template #createGroup>
            <router-link
              :to="{ name: 'groupCreate' }"
              class="underline text-lowercase"
            >
              {{ $t('GROUP.CREATE_TITLE') }}
            </router-link>
          </template>
        </i18n-t>
      </p>
      <div v-if="hasOtherGroupsToShow">
        <GroupGalleryCards
          :groups="filteredOtherGroups"
          @preview="(...args) => $emit('preview', ...args)"
        />
      </div>
    </div>
  </div>
</template>

<script>
import GroupGalleryMap from './GroupGalleryMap'
import GroupGalleryCards from './GroupGalleryCards'
import KSpinner from '@/utils/components/KSpinner'

import {
  QBtn,
  QTooltip,
  QBanner,
  QInput,
  QCheckbox,
  QIcon,
  QResizeObserver,
} from 'quasar'

export default {
  components: {
    GroupGalleryMap,
    GroupGalleryCards,
    KSpinner,
    QBtn,
    QTooltip,
    QBanner,
    QInput,
    QCheckbox,
    QIcon,
    QResizeObserver,
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
    isLoggedIn: {
      default: false,
      type: Boolean,
    },
    fetchStatus: {
      default: null,
      type: Object,
    },
    myCoordinates: {
      default: null,
      type: Object,
    },
  },
  emits: [
    'visit',
    'preview',
  ],
  data () {
    return {
      width: -1, // will get set by our QResizeObserver later
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
      return filteredGroups
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
    paddingTopLeft () {
      // when the sidebar is open on a wide enough desktop screen
      // we set the padding so the markers aren't displayed underneath the sidebar
      if (this.expanded && this.$q.platform.is.desktop && this.width !== -1) {
        return [this.width, 0]
      }
      return null
    },
  },
  methods: {
    onResize ({ width }) {
      this.width = width
    },
    searchInName (term, list) {
      if (!term || term === '') return list
      return list.filter(group => {
        return group.name && group.name.toLowerCase().includes(term.toLowerCase())
      })
    },
  },
}
</script>

<style scoped lang="sass">
.gallery-wrapper
  .overlay-toggle-button
    i
      transition: transform .5s

      &.slightly-rotated
        transform: rotate(-180deg)

  .sidebar
    z-index: 2
    width: 100%
    padding: 5px
    background-color: rgba(255, 255, 255, 0.8)

    .text-primary
      margin-left: .2em

    .underline
      text-decoration: underline

    .header
      padding-top: 14px
      margin-left: 10px
      font-size: 1.4em

body.desktop .gallery-wrapper
  .map-fixed
    position: fixed
    right: 0
    left: 0
    z-index: 0
    height: 100vh

  .sidebar
    &.expanded
      padding-bottom: 3em
    @media screen and (min-width: $breakpoint-sm)
      max-width: 42vw
      padding: 0 1em 1em 1em
      box-shadow: 6px 0px 5px 0px rgba(0, 0, 0, 0.3)

      &.expanded
        min-height: 100vh

body.mobile .gallery-wrapper
  .map-fixed
    z-index: 0
    width: 100%
    height: 60vh

  .sidebar
    z-index: 0
    min-height: 10vh
    padding-bottom: 3em
    margin-top: 0
    margin-bottom: 40px
    transition: all .7s

    &.expanded
      min-height: 60vh
      margin-top: -60vh
</style>

<style lang="sass">
body.mobile .gallery-wrapper.expanded .map-fixed .leaflet-control-container .leaflet-left
  display: none

@media screen and (max-width: $breakpoint-sm)
  body.desktop .gallery-wrapper .map-fixed .leaflet-control-container .leaflet-left
    display: none

@media screen and (min-width: $breakpoint-sm)
  body.desktop .gallery-wrapper .map-fixed .leaflet-control-container .leaflet-left
    left: 42vw
</style>
