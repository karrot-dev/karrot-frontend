<template>
  <div>
    <KTopbar/>
    <div class="content row justify-around ">
      <div class="sidenav" v-if="$slots['sidenav']">
        <slot name="sidenav"/>
      </div>
      <div class="main">
        <slot>Content</slot>
      </div>
    </div>
    <KFooter/>
  </div>
</template>

<script>

import KTopbar from './KTopbar.vue'
import KFooter from './KFooter.vue'

export default {
  components: {KTopbar, KFooter}
}
</script>

<style scoped lang="stylus">
  .sidenav
    width 22%
    min-width 15em
  .main
    width 60%
    padding-top: 1em
  .content
    margin-bottom 1em
    min-height 90vh
</style>