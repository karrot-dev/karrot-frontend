<template>
  <transition-group
    name="list-complete"
    class="row">
    <div
      v-for="group in groups"
      :key="group.id"
      class="list-complete-item inline-block col-xs-12 items-stretch"
      :class="groups.length == 1 ? '' : $q.platform.is.desktop ? 'col-lg-6 col-xl-4' : 'col-sm-6 col-lg-4'">
      <GroupGalleryCard
        v-if="groups.length != 1"
        :class="{highlight: group.id === currentGroupId}"
        :group="group"
        :is-member="isMember"
        @preview="$emit('showPreview', group)"
        @visit="$emit('visit', { groupId: group.id })"
      />
      <GroupPreview
        v-if="groups.length == 1"
        :show-close="previewOpened"
        @close="$emit('hidePreview')"
        :group="group"
        :is-logged-in="isLoggedIn"/>
    </div>
  </transition-group>
</template>

<script>
import GroupGalleryCard from './GroupGalleryCard'
import GroupPreview from './GroupPreview'
import { QAlert, QSearch, QCard } from 'quasar'

export default {
  props: {
    groups: {
      default: () => [],
      type: Array,
    },
    currentGroupId: {
      default: -1,
      type: Number,
    },
    isLoggedIn: {
      required: true,
      type: Boolean,
    },
    isMember: {
      default: false,
      type: Boolean,
    },
    previewOpened: {
      default: false,
      type: Boolean,
    },
  },
  components: { GroupGalleryCard, QAlert, QSearch, QCard, GroupPreview },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.highlight
  border 2px solid $positive

.list-complete-item
  transition: all .7s
  display: inline-block

.list-complete-enter, .list-complete-leave-to
  opacity: 0
  transform: translateY(2000px)

.list-complete-leave-active
  position: absolute
</style>
