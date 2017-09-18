<template>
    <div class="background mainLayoutDesktop">
      <q-layout :reveal="$q.platform.is.mobile" class="wrapper" ref="layout" :view="layoutView" :right-breakpoint="1100">
        <div slot="header">
          <KTopbar slot="header">
            <q-btn slot="left" flat @click="$refs.layout.toggleLeft()">
              <i class="fa fa-bars"></i>
            </q-btn>
          </KTopbar>
        </div>
        <template slot="left" v-if="$q.platform.is.mobile">
          <MobileSidenav/>
        </template>
        <div class="mainContent row justify no-wrap">
          <div class="whiteSpace gt-sm"/>
          <div class="desktop-only sidenav-desktop">
            <slot name="sidenav-desktop"/>
          </div>
          <div class="whiteSpaceSmall gt-sm"/>
          <div class="mainContent-page">
            <slot>Content</slot>
            <q-btn flat @click="$refs.layout.toggleLeft()">
              <i class="fa fa-bars on-left"></i>Open Sidenav
            </q-btn>
          </div>
          <div class="whiteSpace gt-sm"/>
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
import MobileSidenav from './MobileSidenav'
import { QLayout, QBtn } from 'quasar'

export default {
  components: { KTopbar, KFooter, MobileNavigation, MobileSidenav, QLayout, QBtn },
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


<style scoped lang="stylus">
.sidenav-desktop
  margin-right 2em
  width 30%
  min-width 250px
body.desktop .mainContent-page
  min-width 400px
body.mobile .mainContent-page
  width 100%
.whiteSpace
  width 5%
.whiteSpaceSmall
  width 2%
</style>
