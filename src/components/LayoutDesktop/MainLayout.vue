<template>
    <div class="background mainLayoutDesktop">
      <q-layout class="wrapper" ref="layout" view="hHh lpr fff" :right-breakpoint="1100">
        <div slot="header">
          
          <KTopbar slot="header">
            <q-btn slot="left" flat @click="$refs.layout.toggleLeft()">
              <i class="fa fa-bars"></i>
            </q-btn>
          </KTopbar>
        </div>
        <template slot="left">
          <div class="leftContent">
            <slot name="sidenav"/>
          </div>
        </template>
        <div>
          <slot>Content</slot>
        </div>

        <KFooter slot="footer"/>
      </q-layout>
    </div>
</template>

<script>

import KTopbar from './KTopbar.vue'
import KFooter from './KFooter.vue'
import { QLayout, QBtn } from 'quasar'

export default {
  components: {KTopbar, KFooter, QLayout, QBtn}
}
</script>


<!-- This in NOT scoped! -->
<style lang="stylus">
.mainLayoutDesktop
  .layout-aside.on-layout
    width: 40%
    min-width 20em
    overflow: hidden
    padding 1em
    .leftContent
      min-width 20em
      width 80%
      margin-left 5%
  .layout-aside.on-top
    .leftContent
      width: 95%
</style>