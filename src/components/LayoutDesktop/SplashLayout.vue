<template>
  <div class="wrapper">
    <div class="main">
      <div class="slotContent">
        <slot>Content</slot>
      </div>
    </div>
    <KFooter class="KFooter"/>
    <KTopbar class="KTopbar"/>
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
  .wrapper
    position relative
    height: 100%
    width: 100%
    .KFooter
      position fixed
      bottom 0.3em
      right 0
      left 0
    .main
      position absolute
      bottom 0
      right 0
      left 0
      top 0
      .slotContent
        margin auto
        margin-top 10vh
        max-width 60em
        width 80%
</style>