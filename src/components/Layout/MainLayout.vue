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
        <div class="mainContent row justify-between no-wrap">
          <div class="whiteSpace gt-sm desktop-only"/>
            <router-view class="desktop-only sidenav-desktop" name="sidenav"></router-view>
          <div class="mainContent-page">
            <router-view></router-view>
            <q-btn class="mobile-only" flat @click="$refs.layout.toggleLeft()">
              <i class="fa fa-bars on-left"></i>Open Sidenav
            </q-btn>
          </div>
          <div class="whiteSpace gt-sm desktop-only"/>
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
  margin-right 1em
  width 30%
  min-width 250px
  max-width 30em
body.desktop .mainContent-page
  min-width 400px
  max-width: 57em
.mainContent-page
  width 100%
.whiteSpace
  width 5%

.background
  background-image url('../../assets/repeating_grey.jpg')
  background-size: 600px
  background-attachment:fixed
</style>
