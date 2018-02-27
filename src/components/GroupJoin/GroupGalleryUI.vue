<template>
  <div
    class="column gallery-wrapper"
    :class="{'showOverlay': showOverlay, 'hideOverlay': !showOverlay}">
    <q-btn
      v-if="!showOverlay"
      @click="showOverlay = true"
      flat
      class="float-right overlay-toggle-button mobile-only lt-md"
    >
      <i class="fa fa-2x fa-info"/>
      <q-tooltip>
        {{ $t('BUTTON.BACK') }}
      </q-tooltip>
    </q-btn>
    <div class="group-gallery row no-wrap items-start">
      <div class="overlay all-groups col-xs-12 col-md-5">
        <q-btn
          @click="showOverlay = !showOverlay"
          flat
          class="float-right overlay-toggle-button"
        >
          <i
            class="fa fa-2x fa-close"
            :class="{'slightly-rotated': !showOverlay}"/>
          <q-tooltip>
            {{ $t(showOverlay ? 'BUTTON.CLOSE' : 'BUTTON.OPEN') }}
          </q-tooltip>
        </q-btn>
        <transition name="slide-toggle">
          <q-alert
            v-if="!isLoggedIn && showOverlay"
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
        </transition>

        <transition name="slide-toggle">
          <h4
            v-if="showOverlay && myGroups.length>0"
            class="text-primary"
          >
            {{ $t('JOINGROUP.MY_GROUPS') }}
          </h4>
        </transition>
        <transition name="slide-toggle">
          <div
            v-if="showOverlay && myGroups.length>0"
            class="row"
            style="width: 100%"
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
        </transition>
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
            />
          </transition>
        </q-card>
        <transition name="slide-toggle">
          <div
            class="groups-container"
            v-if="showOverlay || previewOpened || filteredGroups.length === 1">
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
        </transition>
      </div>
      <div class="map col-xs-12 col-md-7">
        <div
          class="map-fixed"
          :class="{'showOverlay': showOverlay}">
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
  </div>
</template>

<script>
import GroupGalleryCard from './GroupGalleryCard'
import GroupPreview from './GroupPreview'
import StandardMap from '@/components/Map/StandardMap'
import { QAlert, QSearch, QCard, QBtn, QTooltip } from 'quasar'
import L from 'leaflet'

export default {
  data () {
    return {
      search: '',
      previewOpened: false,
      openedGroupId: -1,
      coords: {lat: 0.0, lng: -100},
      zoom: 2,
      showOverlay: true,
    }
  },
  methods: {
    showPreview (group) {
      this.previewOpened = true
      this.openedGroupId = group.id
      this.coords.lat = group.latitude + this.offset[0]
      this.coords.lng = group.longitude + this.offset[1]
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
        this.coords.lat = this.filteredGroups[0].latitude + this.offset[0]
        this.coords.lng = this.filteredGroups[0].longitude + this.offset[1]
        this.zoom = 10
      }
    },
    groupMarkerId (id) {
      return `group_${id}`
    },
    createJoinedGroupMarker (group) {
      return this.createGroupMarker(group, 'blue')
    },
    createOpenGroupMarker (group) {
      return this.createGroupMarker(group, 'green')
    },
    createGroupMarker (group, color) {
      return {
        latLng: L.latLng(group.latitude, group.longitude),
        id: this.groupMarkerId(group.id),
        icon: L.AwesomeMarkers.icon({
          icon: 'home',
          markerColor: color,
          prefix: 'fa',
        }),
        popupcontent: `<h4><a href="/#/group/${group.id}/">${group.name}</a><h4>`,
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
      let openGroupsWithCoords = this.filteredGroups.filter(group => {
        return group.latitude != null && group.longitude != null
      })
      items.push(...openGroupsWithCoords.map(this.createOpenGroupMarker))

      let joinedGroupsWithCoords = this.myGroups.filter(group => {
        return group.latitude != null && group.longitude != null
      })
      items.push(...joinedGroupsWithCoords.map(this.createJoinedGroupMarker))
      return items
    },
    offset () {
      if (window.innerWidth > 767) {
        return this.showOverlay ? [-0.05, -0.4] : [0.0, -0.2]
      }
      return [0.0, 0.0]
    },
  },
  components: { GroupGalleryCard, QAlert, QSearch, QCard, QBtn, QTooltip, GroupPreview, StandardMap },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.gallery-wrapper
  width 100%
.group-gallery
  width 100vw
body.desktop
  .gallery-wrapper
    overflow hidden
    margin-bottom -10em
  .all-groups
    z-index 2
    background-color rgba(255, 255, 255, 0.8)
    transition min-height .5s
  .map-fixed
    position: fixed
    height: 100vh
    right: 0
    left: 0
    z-index 0
  @media screen and (max-width: $breakpoint-sm)
    .group-gallery
      margin-bottom 12em
    .all-groups
      padding-bottom 20px
  @media screen and (min-width: $breakpoint-sm)
    .all-groups
      padding 0 1em 1em 1em
      box-shadow: 6px 0px 5px 0px rgba(0,0,0,0.3)
    .showOverlay .all-groups
      min-height 100vh
body.mobile
  .all-groups, .map-fixed
    margin-bottom -5em
  .all-groups
    height: 80vh
    overflow auto
    padding .5em
  .groups-container
    padding-bottom 5em
  .map-fixed
    height: 80vh
  @media screen and (max-width: $breakpoint-sm)
    .hideOverlay .all-groups, .showOverlay .map
      display none
    .map-fixed
      width: 100vw
  @media screen and (min-width: $breakpoint-sm)
    .overlay-toggle-button
      display none

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
  width 98%
.underline
  text-decoration underline
.overlay-toggle-button
  margin: 20px
  i
    transition transform .5s
.slightly-rotated
  transform rotate(45deg)

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

@media screen and (max-width: $breakpoint-sm)
  body.desktop .group-gallery .group-gallery-map .leaflet-control-container .leaflet-left
    display none

@media screen and (min-width: $breakpoint-sm)
  body.desktop .group-gallery .group-gallery-map .leaflet-control-container .leaflet-left
    left 42vw
</style>
