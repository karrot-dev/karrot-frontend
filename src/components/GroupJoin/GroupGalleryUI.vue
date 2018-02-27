<template>
  <div class="group-gallery page-wrapper row no-wrap">
    <div class="all-groups col-sm-12 col-md-5">
      <q-alert
        v-if="!isLoggedIn"
        color="info"
        icon="star"
        class="alert"
      >
        <i18n path="JOINGROUP.LOGOUT_MESSAGE.LOGGED_OUT">
          <router-link
            place="login"
            :to="{ name: 'login' }"
            class="underline"
          >
            {{ $t('JOINGROUP.LOGOUT_MESSAGE.LOG_IN') }}
          </router-link>
        </i18n>
      </q-alert>
      <h4
        v-if="myGroups.length>0"
        class="text-primary"
      >
        {{ $t('JOINGROUP.MY_GROUPS') }}
      </h4>
      <div
        v-if="myGroups.length>0"
        class="row"
      >
        <div
          v-for="group in myGroups"
          :key="group.id"
          class="inline-block col-xs-12 col-sm-6 col-md-4 items-stretch">
          <GroupGalleryCard
            :class="{highlight: group.id === currentGroupId}"
            :group="group"
            :is-member="true"
            @preview="$emit('preview', { groupId: group.id })"
            @visit="$emit('visit', { groupId: group.id })"
          />
        </div>
      </div>
      <h4
        class="text-primary generic-padding"
        v-if="otherGroups.length>0"
      >
        {{ $t('JOINGROUP.WHICHGROUP') }}
      </h4>
      <q-card>
        <transition name="slide-toggle">
          <q-search
            v-if="!previewOpened"
            @change="isOneFilteredGroup()"
            class="searchbar"
            v-model="search"
            style="min-height: 0"
          />
        </transition>
      </q-card>
      <transition-group
        name="list-complete"
        v-if="otherGroups.length>0"
        class="row">
        <div
          v-for="group in filteredGroups"
          :key="group.id"
          class="list-complete-item inline-block col-xs-12 col-sm-6 col-xl-4 items-stretch"
          v-if="!previewOpened || group.id === openedGroupId || filteredGroups.length == 1"
          :class="group.id === openedGroupId || filteredGroups.length == 1 ? 'col-xs-12 col-sm-12 col-xl-12' : ''"
        >
          <GroupGalleryCard
            :group="group"
            v-if="!previewOpened && filteredGroups.length != 1"
            :is-member="false"
            @preview="showPreview(group)"
          />
          <GroupPreview
            v-if="previewOpened || filteredGroups.length == 1"
            :show-close="filteredGroups.length != 1"
            @close="hidePreview()"
            :group="group"
            :is-logged-in="isLoggedIn"/>
        </div>
      </transition-group>
    </div>
    <div class="map col-md-7 gt-sm">
      <div class="map-absolute">
        <StandardMap
          class="group-gallery-map"
          :markers="markers"
          :force-center="coords"
          :force-zoom="zoom"
          :show-attribution="false"
        />
      </div>
    </div>
  </div>
</template>

<script>
import GroupGalleryCard from './GroupGalleryCard'
import GroupPreview from './GroupPreview'
import StandardMap from '@/components/Map/StandardMap'
import { QAlert, QSearch, QCard } from 'quasar'
import L from 'leaflet'

export default {
  data () {
    return {
      search: '',
      previewOpened: false,
      openedGroupId: -1,
      coords: {lat: 0.0, lng: -100},
      zoom: 2,
    }
  },
  methods: {
    showPreview (group) {
      this.previewOpened = true
      this.openedGroupId = group.id
      this.coords.lat = group.latitude - 0.05
      this.coords.lng = group.longitude - 0.4
      this.zoom = 10
      // this.coords = group
      window.history.replaceState({}, null, this.$router.resolve({ name: 'groupPreview', params: { groupPreviewId: group.id } }).href)
    },
    hidePreview () {
      this.previewOpened = false
      this.openedGroupId = -1
      window.history.replaceState({}, null, `#${this.$route.path}`)
    },
    isOneFilteredGroup () {
      if (this.filteredGroups.length === 1) {
        this.coords.lat = this.filteredGroups[0].latitude - 0.05
        this.coords.lng = this.filteredGroups[0].longitude - 0.4
        this.zoom = 10
      }
    },
    groupMarkerId (id) {
      return `group_${id}`
    },
    createGroupMarker (group) {
      return {
        latLng: L.latLng(group.latitude, group.longitude),
        id: this.groupMarkerId(group.id),
        icon: L.AwesomeMarkers.icon({
          icon: 'home',
          markerColor: 'green',
          prefix: 'fa',
        }),
        popupcontent: `<a href="/#/group/${group.id}/">${group.name}</a>`,
      }
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
    markers () {
      let items = []
      items.push(...this.filteredGroups.map(this.createGroupMarker))
      return items
    },
  },
  components: { GroupGalleryCard, QAlert, QSearch, QCard, GroupPreview, StandardMap },
}
</script>

<style scoped lang="stylus">
@import '~variables'

@media screen and (max-width: $breakpoint-sm)
  body.desktop .page-wrapper
    max-width 90em
    margin-left auto
    margin-right auto

@media screen and (min-width: $breakpoint-sm)
  .all-groups, body.desktop .map
    margin-bottom -10em
  .map
    z-index 90
  .all-groups
    background-color rgba(255, 255, 255, 0.8)
    padding 0 1em 1em 1em
    min-height 100vh
    z-index 100
    box-shadow: 6px 0px 10px 0px rgba(0,0,0,0.3)
.map-absolute
  position: fixed
  width: 100vw
  height: 100vh
  right: 0
body.desktop .alert
  margin 2em 8px 2.5em 8px
.text-primary
  margin-left .2em
.highlight
  border 2px solid $positive
.searchbar
  margin-top .2em
  vertical-align middle
  height 45px
  padding 5px
.underline
  text-decoration underline

.list-complete-item
  transition: all .7s
  display: inline-block

.list-complete-enter, .list-complete-leave-to
  opacity: 0
  transform: translateY(2000px)

.list-complete-leave-active
  position: absolute

.slide-toggle-enter-active,
.slide-toggle-leave-active
  transition all .2s
  min-height = 0
  overflow hidden
.slide-toggle-enter-to
    max-height 400px
.slide-toggle-enter,
.slide-toggle-leave-active
    max-height 0
    opacity 0
.slide-toggle-leave
    max-height 400px
</style>

<style lang="stylus">
@import '~variables'

@media screen and (min-width: $breakpoint-sm)
  .group-gallery .group-gallery-map .leaflet-control-container .leaflet-left
    left 42vw
</style>
