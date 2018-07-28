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
    applications: { required: true, type: Array }
  },
  computed: {
  },
}
</script>

<style scoped lang="stylus">
</style>
