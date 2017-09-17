<template>
  <div class="wrapper">
    <div class="prevBread gt-sm" v-for="breadcrumb in prevElements" :key="breadcrumb">
      <q-btn flat small>{{ breadcrumb }}</q-btn>
      <div> > </div>
    </div>
    <div class="q-btn q-btn-flat label">{{ lastElement }}</div>
  </div>
</template>

<script>
import { QBtn } from 'quasar'

export default {
  components: { QBtn },
  props: {
    breadcrumbs: { required: true },
  },
  computed: {
    prevElements () {
      let prev = this.breadcrumbs.slice()
      prev.pop()
      return prev
    },
    lastElement () {
      return this.breadcrumbs[this.breadcrumbs.length - 1]
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.wrapper
  .prevBread, .q-btn, div
    display inline-block
  .label
    cursor auto
</style>