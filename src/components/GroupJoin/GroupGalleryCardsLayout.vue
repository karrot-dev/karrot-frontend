<template>
  <div
    :class="{'expanded': expanded}"
    class="all-groups"
  >
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
    <p
      class="text-primary header"
      v-if="!hasJoinedGroups"
    >
      {{ $t('JOINGROUP.WHICHGROUP') }}
    </p>
    <div class="row no-wrap">
      <div style="width: 100%; padding: 0">
        <q-card style="width: 100%">
          <q-search
            :value="search"
            @input="$emit('search', arguments[0])"
            class="searchbar"
          />
        </q-card>

        <q-checkbox
          :value="showInactive"
          @input="$emit('setShowInactive', arguments[0])"
          :label="$t('GROUP.SHOW_INACTIVE')"
          style="margin-left: 16px"
        />
      </div>
      <div style="width: 100px">
        <slot />
      </div>
    </div>
    <GroupGalleryCard
      v-if="showPlaygroundGroupAtTop"
      style="width: 100%"
      :group="playgroundGroup"
      @preview="showPreview"
      @visit="$emit('visit', arguments[0])"
    />
    <template v-if="previewOpened">
      <transition name="slide-toggle">
        <GroupPreview
          show-close
          @close="hidePreview"
          :group="groupForPreview"
          :is-logged-in="isLoggedIn"
          style="width: 100%"
        />
      </transition>
    </template>
    <template v-else>
      <transition name="slide-toggle">
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
            @preview="showPreview"
            @visit="$emit('visit', arguments[0])"
          />
        </div>
      </transition>
      <p
        class="text-primary header"
        v-if="hasJoinedGroups && hasOtherGroupsToShow"
      >
        {{ $t('JOINGROUP.WHICHGROUP') }}
      </p>
      <transition name="slide-toggle">
        <div v-if="hasOtherGroupsToShow">
          <GroupGalleryCards
            :groups="filteredOtherGroups"
            :is-logged-in="isLoggedIn"
            :preview-opened="previewOpened"
            @preview="showPreview"
          />
        </div>
      </transition>
      <hr
        v-if="showPlaygroundGroupAtBottom"
        style="margin: 20px 10px; border-color: #eee"
      >
      <GroupGalleryCard
        v-if="showPlaygroundGroupAtBottom"
        style="width: 100%"
        :group="playgroundGroup"
        @preview="showPreview"
      />
    </template>
  </div>
</template>

<script>
import GroupGalleryCards from './GroupGalleryCards'
import GroupGalleryCard from './GroupGalleryCard'
import GroupPreview from './GroupPreview'
import { QAlert, QSearch, QCard, QCheckbox } from 'quasar'

export default {
  components: { GroupGalleryCards, GroupGalleryCard, QAlert, QSearch, QCard, QCheckbox, GroupPreview },
  props: {
    filteredMyGroups: {
      default: () => [],
      type: Array,
    },
    filteredOtherGroups: {
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
    hasJoinedGroups: {
      default: true,
      type: Boolean,
    },
    expanded: {
      default: true,
      type: Boolean,
    },
    groupForPreview: {
      default: null,
      type: Object,
    },
    search: {
      default: '',
      type: String,
    },
    showInactive: {
      default: false,
      type: Boolean,
    },
  },
  methods: {
    showPreview (group) {
      this.$emit('showPreview', group)
      this.replaceWindowHistory(group)
    },
    hidePreview () {
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
    previewOpened () {
      return Boolean(this.groupForPreview)
    },
    hasMyGroupsToShow () {
      return this.expanded && this.filteredMyGroups.length > 0
    },
    hasOtherGroupsToShow () {
      return this.expanded && this.filteredOtherGroups.length > 0
    },
    showPlaygroupGroupAtTopOrBottom () {
      if (this.search) return false
      if (this.previewOpened) return false
      if (!this.expanded) return false
      if (!this.playgroundGroup) return false
      if (this.playgroundGroup && this.playgroundGroup.isMember) return false
      return true
    },
    showPlaygroundGroupAtTop () {
      if (this.showPlaygroupGroupAtTopOrBottom) {
        if (this.isLoggedIn && !this.hasJoinedGroups) return true
        if (!this.isLoggedIn) return true
        return false
      }
      return false
    },
    showPlaygroundGroupAtBottom () {
      return this.showPlaygroupGroupAtTopOrBottom && !this.showPlaygroundGroupAtTop
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
  margin 10px 8px 10px 8px
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
  overflow hidden
.slide-toggle-enter-to
    max-height 400px
.slide-toggle-enter,
.slide-toggle-leave-active
    max-height 0
    opacity 0
.slide-toggle-leave
    max-height 400px

.header
  font-size 1.4em
  padding-top 14px
  margin-left 10px
</style>
