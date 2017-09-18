<template>
  <div class="wrapper">
    <div class="prevBread gt-sm" v-for="breadcrumb in prevElements" :key="breadcrumb">
      <router-link :to="breadcrumb.route">
        <q-btn flat small v-if="breadcrumb.name">{{ breadcrumb.name }}</q-btn>
        <q-btn flat small v-if="breadcrumb.translation">{{ $t(breadcrumb.translation) }}</q-btn>
      </router-link>      
      <div> > </div>
    </div>
    <div class="label" v-if="lastElement.name">{{ lastElement.name }}</div>
    <div class="label" v-if="lastElement.translation">{{ $t(lastElement.translation) }}</div>
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
      if (this.breadcrumbs.length === 0) return []
      let prev = this.breadcrumbs.slice()
      prev.pop()
      return prev
    },
    lastElement () {
      console.log('breadcrumbs', this.breadcrumbs)
      if (this.breadcrumbs.length === 0) return ''
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