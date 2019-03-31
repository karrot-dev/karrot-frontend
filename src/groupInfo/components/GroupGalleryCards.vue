<template>
  <div>
    <QResizeObservable
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
  components: {
    GroupGalleryCard,
    QResizeObservable,
  },
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
