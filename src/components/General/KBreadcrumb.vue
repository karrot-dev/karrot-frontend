<template>
  <div class="wrapper">
    <div class="prevBread gt-sm" v-for="breadcrumb in prevElements" :key="breadcrumb">
      <q-btn flat small>{{ breadcrumb }}</q-btn>
      <div> > </div>
    </div>
    <div class="label">{{ lastElement }}</div>
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
    text-overflow ellipsis
    justify-content center
    outline 0
    border 
    vertical-align middle
    padding 0 16px
    font-weight 500
    text-transform uppercase
</style>