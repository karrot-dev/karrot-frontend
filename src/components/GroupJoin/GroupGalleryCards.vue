<template>
  <div>
    <q-resize-observable
      style="width: 100%"
      @resize="onResize"
    />
    <transition-group
      name="list-complete"
      class="row"
    >
      <GroupGalleryCard
        v-for="group in groups"
        :key="group.id"
        class="list-complete-item"
        :style="cardStyle"
        :group="group"
        @preview="$emit('preview', arguments[0])"
        @visit="$emit('visit', { groupId: group.id })"
      />
    </transition-group>
  </div>
</template>

<script>
import GroupGalleryCard from './GroupGalleryCard'
import { QResizeObservable } from 'quasar'

export default {
  props: {
    groups: {
      default: () => [],
      type: Array,
    },
    isLoggedIn: {
      required: true,
      type: Boolean,
    },
  },
  components: { GroupGalleryCard, QResizeObservable },
  data () {
    return {
      width: 230,
    }
  },
  methods: {
    onResize ({ width }) {
      this.width = width
    },
  },
  computed: {
    cols () {
      return Math.max(1, Math.floor(this.width / 230))
    },
    cardStyle () {
      return {
        width: (100 / this.cols) + '%',
      }
    },
  },
}
</script>

<style scoped lang="stylus">
.list-complete-item
  transition: all .7s

.list-complete-enter, .list-complete-leave-to
  opacity: 0
  transform: translateY(2000px)

.list-complete-leave-active
  position: absolute
</style>
