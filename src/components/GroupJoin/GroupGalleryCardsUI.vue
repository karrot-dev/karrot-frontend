<template>
  <div
    :class="{'expanded': expanded}"
    class="all-groups">
    <div
      v-if="showMyGroups"
      class="row no-wrap">
      <transition name="slide-toggle">
        <div
          style="width: 100%; padding: 0"
          v-if="!previewOpened">
          <q-card style="margin-top: 16px">
            <q-search
              @change="$emit('search', arguments[0])"
              class="searchbar"
            />
          </q-card>
        </div>
      </transition>
      <div style="width: 100px">
        <slot />
      </div>
    </div>
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
        v-if="expanded && myGroups.length>0"
        class="join-groups">
        <h4 class="text-primary">
          {{ $t('JOINGROUP.MY_GROUPS') }}
        </h4>
        <div
          class="row"
          style="width: 100%"
        >
          <div
            v-for="group in myGroups"
            :key="group.id"
            class="inline-block col-xs-12 col-sm-6 col-lg-4 items-stretch">
            <GroupGalleryCard
              :class="{highlight: group.id === currentGroupId}"
              :group="group"
              :is-member="true"
              @preview="$emit('preview', { groupId: group.id })"
              @visit="$emit('visit', { groupId: group.id })"
            />
          </div>
        </div>
      </div>
    </transition>
    <h4
      class="text-primary generic-padding"
      v-if="showOtherGroups && (expanded || !showMyGroups) && (otherGroups.length > 0 || !showMyGroups)"
    >
      {{ $t('JOINGROUP.WHICHGROUP') }}
    </h4>
    <transition name="slide-toggle">
      <q-card v-if="!previewOpened && !showMyGroups">
        <q-search
          @change="$emit('search', arguments[0])"
          class="searchbar"
        />
      </q-card>
    </transition>
    <transition name="slide-toggle">
      <div
        class="groups-container"
        v-if="expanded || previewOpened || otherGroups.length === 1">
        <transition-group
          name="list-complete"
          v-if="showOtherGroups"
          class="row">
          <div
            v-for="group in otherGroups"
            :key="group.id"
            class="list-complete-item inline-block col-xs-12 col-sm-6 col-lg-4 items-stretch"
            v-if="!previewOpened || group.id === openedGroupId || otherGroups.length == 1"
            :class="group.id === openedGroupId || otherGroups.length == 1 ? 'col-xs-12 col-sm-12 col-lg-12' : ''"
          >
            <GroupGalleryCard
              :group="group"
              v-if="!previewOpened && otherGroups.length != 1"
              :is-member="false"
              @preview="showPreview(group)"
            />
            <GroupPreview
              v-if="previewOpened || otherGroups.length == 1"
              :show-close="otherGroups.length != 1"
              @close="hidePreview()"
              :group="group"
              :is-logged-in="isLoggedIn"/>
          </div>
        </transition-group>
      </div>
    </transition>
  </div>
</template>

<script>
import GroupGalleryCard from './GroupGalleryCard'
import GroupPreview from './GroupPreview'
import { QAlert, QSearch, QCard } from 'quasar'

export default {
  data () {
    return {
      previewOpened: false,
      openedGroupId: -1,
    }
  },
  methods: {
    showPreview (group) {
      this.previewOpened = true
      this.openedGroupId = group.id
      this.$emit('showPreview', group)
      window.history.replaceState({}, null, this.$router.resolve({ name: 'groupPreview', params: { groupPreviewId: group.id } }).href)
    },
    hidePreview () {
      this.previewOpened = false
      this.openedGroupId = -1
      this.$emit('showPreview', null)
      window.history.replaceState({}, null, `#${this.$route.path}`)
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
    showMyGroups: {
      default: true,
      type: Boolean,
    },
    showOtherGroups: {
      default: true,
      type: Boolean,
    },
    expanded: {
      default: true,
      type: Boolean,
    },
  },
  components: { GroupGalleryCard, QAlert, QSearch, QCard, GroupPreview },
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
