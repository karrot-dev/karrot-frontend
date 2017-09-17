<template>
    <div class="background mainLayoutDesktop">
      <q-layout class="wrapper" ref="layout" :view="layoutView" :right-breakpoint="1100">
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
        <div class="mainContent">
          <q-btn flat @click="$refs.layout.toggleLeft()">
            <i class="fa fa-bars"></i>
          </q-btn>
          <slot>Content</slot>
        </div>

        <MobileNavigation class="mobile-only" slot="footer"></MobileNavigation>
        <KFooter class="desktop-only" slot="footer"/>
      </q-layout>
    </div>
</template>

<script>

import KTopbar from './KTopbar.vue'
import KFooter from './KFooter.vue'
import MobileNavigation from './MobileNavigation.vue'
import { QLayout, QBtn } from 'quasar'

export default {
  components: {KTopbar, KFooter, MobileNavigation, QLayout, QBtn},
  computed: {
    layoutView () {
      console.log(this.$q.platform.is.mobile)
      if (this.$q.platform.is.mobile) {
        return 'hHh lpr fFf'
      }
      return 'hHh lpr fff'
    },
  },
}
</script>


<!-- This in NOT scoped! -->
<style lang="stylus">
.mainLayoutDesktop
  .mainContent
    padding 1em
  .layout-aside
    transition: all 0s !important
  .layout-page-container
    transition: all 0s !important
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
