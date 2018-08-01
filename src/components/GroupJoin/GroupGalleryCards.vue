<template>
  <div>
    <q-resize-observable
      style="width: 100%"
      @resize="onResize"
    />
    <GroupGalleryCard
      v-for="group in groups"
      :key="group.id"
      :style="cardStyle"
      :group="group"
      @preview="$emit('preview', group.id)"
      @visit="$emit('visit', group.id)"
    />
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
