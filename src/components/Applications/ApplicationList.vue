<template>
  <q-infinite-scroll>
    <ApplicationItem

    />
  </q-infinite-scroll>
</template>

<script>
import ApplicationItem from './ApplicationItem'
import QInfiniteScroll from 'quasar'

export default {
  components: {
    QInfiniteScroll, ApplicationItem,
  },
  props: {
    groupApplications: {
      type: Array,
      default: null,
    },
  },
  computed: {
  },
}
</script>

<style scoped lang="stylus">
</style>
