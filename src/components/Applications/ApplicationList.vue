<template>
  <div>
    <ApplicationItem
      v-for="a in groupApplications"
      :key="a.id"
      :application="a"
    />
  </div>
</template>

<script>
import ApplicationItem from './ApplicationItem'

export default {
  components: {
    ApplicationItem,
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
