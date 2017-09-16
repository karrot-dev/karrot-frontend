<template>
  <!--<div class="wrapper">
    <div class="main">
      <div class="slotContent">
        <slot>Content</slot>
      </div>
    </div>
    <KFooter class="KFooter"/>
    <KTopbar class="KTopbar"/>
  </div>-->
  <div class="background">
    <q-layout class="wrapper" ref="layout" view="hHr LpR lFf" :right-breakpoint="1100">
      <KTopbar name="header"/>

      <div class="slotContent">
        <slot>Content</slot>
      </div>

      <KFooter slot="footer"/>
    </q-layout>
  </div>
</template>

<script>

import KTopbar from './KTopbar.vue'
import KFooter from './KFooter.vue'
import { QLayout } from 'quasar'

export default {
  components: {KTopbar, KFooter, QLayout}
}
</script>

<style scoped lang="stylus">
.background
  background-image url('../../assets/repeating_grey.jpg')
  background-size: 600px
  height 100vh
.wrapper
  .slotContent
    margin auto
    margin-top 10vh
    max-width 50em
    width 90%
</style>