<template>
  <div>
    <QResizeObserver
      style="width: 100%"
      @resize="onResize"
    />
    <GroupGalleryCard
      v-for="group in groups"
      :key="group.id"
      :style="cardStyle"
      :group="group"
    />
  </div>
</template>

<script>
import { QResizeObserver } from 'quasar'

import GroupGalleryCard from './GroupGalleryCard.vue'

export default {
  components: {
    GroupGalleryCard,
    QResizeObserver,
  },
  props: {
    groups: {
      default: () => [],
      type: Array,
    },
  },
  data () {
    return {
      width: 230,
    }
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
  methods: {
    onResize ({ width }) {
      this.width = width
    },
  },
}
</script>
