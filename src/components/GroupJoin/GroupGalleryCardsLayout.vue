<template>
  <div
    :class="{'expanded': expanded}"
    class="all-groups">
    <transition name="slide-toggle">
      <div
        v-if="showMyGroups && !previewOpened"
        class="row no-wrap">
        <div style="width: 100%; padding: 0">
          <q-card style="margin-top: 16px">
            <q-search
              @change="$emit('search', arguments[0])"
              class="searchbar"
              v-model="search"
            />
          </q-card>
        </div>
        <div style="width: 100px">
          <slot />
        </div>
      </div>
    </transition>
    <slot v-if="!showMyGroups"/>
    <transition name="slide-toggle">
      <q-alert
        v-if="!isLoggedIn && expanded"
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
      <div
        v-if="hasMyGroupsToShow || (filteredOtherGroups.length == 0 && filteredMyGroups.length == 1)"
        class="join-groups">
        <h4 class="text-primary">
          {{ $t('JOINGROUP.MY_GROUPS') }}
        </h4>
        <GroupGalleryCards
          :groups="filteredMyGroups"
          :current-group-id="currentGroupId"
          :is-logged-in="isLoggedIn"
          :preview-opened="previewOpened"
          :is-member="true"
          @showPreview="showPreview"
          @hidePreview="hidePreview"
          @visit="$emit('visit', arguments[0])"
        />
      </div>
    </transition>
    <h4
      class="text-primary generic-padding"
      v-if="hasOtherGroupsToShow || !showMyGroups"
    >
      {{ $t('JOINGROUP.WHICHGROUP') }}
    </h4>
    <transition name="slide-toggle">
      <q-card v-if="!previewOpened && !showMyGroups">
        <q-search
          @change="$emit('search', arguments[0])"
          class="searchbar"
          v-model="search"
        />
      </q-card>
    </transition>
    <transition name="slide-toggle">
      <div v-if="hasOtherGroupsToShow || (filteredOtherGroups.length == 1 && filteredMyGroups.length == 0)">
        <GroupGalleryCards
          :groups="filteredOtherGroups"
          :current-group-id="currentGroupId"
          :is-logged-in="isLoggedIn"
          :preview-opened="previewOpened"
          @showPreview="showPreview"
          @hidePreview="hidePreview"
        />
      </div>
    </transition>
    <GroupGalleryCard
      v-if="showPlaygroundGroupAtBottom"
      style="margin-top: 40px"
      :group="playgroundGroup"
      :is-member="playgroundGroup.isMember"
      @preview="showPreview"
      @visit="$emit('visit', arguments[0])"
    />
  </div>
</template>

<script>
import GroupGalleryCards from './GroupGalleryCards'
import GroupGalleryCard from './GroupGalleryCard'
import GroupPreview from './GroupPreview'
import { QAlert, QSearch, QCard } from 'quasar'

export default {
  components: { GroupGalleryCards, GroupGalleryCard, QAlert, QSearch, QCard, GroupPreview },
  data () {
    return {
      previewOpened: false,
      openedGroup: null,
      search: '',
    }
  },
  methods: {
    showPreview (group) {
      this.previewOpened = true
      this.openedGroup = group
      this.$emit('showPreview', group)
      this.replaceWindowHistory(group)
    },
    hidePreview () {
      this.previewOpened = false
      this.openedGroupId = -1
      this.$emit('showPreview', null)
      this.replaceWindowHistory(null)
    },
    replaceWindowHistory (group) {
      if (group) {
        window.history.replaceState({}, null, this.$router.resolve({ name: 'groupPreview', params: { groupPreviewId: group.id } }).href)
      }
      else {
        window.history.replaceState({}, null, `#${this.$route.path}`)
      }
    },
  },
  computed: {
    filteredMyGroups () {
      if (this.previewOpened) {
        if (this.openedGroup.isMember) {
          return [this.openedGroup]
        }
        return []
      }
      return this.myGroups
    },
    filteredOtherGroups () {
      if (this.previewOpened) {
        if (!this.openedGroup.isMember) {
          return [this.openedGroup]
        }
        return []
      }
      return this.otherGroups
    },
    hasMyGroupsToShow () {
      return this.expanded && this.filteredMyGroups.length > 0
    },
    hasOtherGroupsToShow () {
      return this.expanded && this.filteredOtherGroups.length > 0
    },
    showPlaygroundGroupAtBottom () {
      return this.playgroundGroup && !this.playgroundGroup.isMember
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
    playgroundGroup: {
      default: undefined,
      type: Object,
    },
    isLoggedIn: {
      required: true,
      type: Boolean,
    },
    currentGroupId: {
      default: -1,
      type: Number,
    },
    showMyGroups: {
      default: true,
      type: Boolean,
    },
    expanded: {
      default: true,
      type: Boolean,
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.all-groups
  z-index 2
  width 100%
  background-color rgba(255, 255, 255, 0.8)
  transition min-height .5s
  padding 5px
@media screen and (min-width: $breakpoint-sm)
  .all-groups
    padding 0 1em 1em 1em
    box-shadow: 6px 0px 5px 0px rgba(0,0,0,0.3)
  .expanded.all-groups
    min-height 100vh

body.desktop .alert
  margin 10px 8px 2.5em 8px
.text-primary
  margin-left .2em
.searchbar
  margin-top .2em
  vertical-align middle
  height 45px
  padding 5px
  width 98%
.underline
  text-decoration underline

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
