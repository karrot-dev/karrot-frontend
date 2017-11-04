<template>
    <div class="background mainLayoutDesktop">
      <q-layout :reveal="$q.platform.is.mobile" class="wrapper" ref="layout" :view="layoutView" :right-breakpoint="1100">
        <div slot="header">
          <KTopbar  @toggleSidenav="$refs.layout.toggleLeft()" v-if="isLoggedIn" slot="header">
            <q-btn slot="left" flat @click="$refs.layout.toggleLeft()">
              <i class="fa fa-bars"></i>
            </q-btn>
          </KTopbar>
          <KTopbarLoggedOut v-if="!isLoggedIn" slot="header">
          </KTopbarLoggedOut>
        </div>
        <template slot="left" v-if="$q.platform.is.mobile">
          <MobileSidenav @toggleSidenav="$refs.layout.toggleLeft()" />
        </template>
        <MainAlerts />
        <div class="mainContent row justify-between no-wrap">
          <div class="whiteSpace gt-sm" />
          <router-view v-if="!$q.platform.is.mobile" class="sidenav-desktop" name="sidenav" />
          <div class="mainContent-page">
            <router-view />
          </div>
          <div class="whiteSpace gt-sm desktop-only"/>
        </div>
        <KFooter v-if="$q.platform.is.mobile && !isLoggedIn"/>

        <MobileNavigation v-if="$q.platform.is.mobile && isLoggedIn" slot="footer" />
        <KFooter v-if="!$q.platform.is.mobile" slot="footer"/>
      </q-layout>
    </div>
</template>

<script>

import KTopbar from '@/components/Layout/KTopbar'
import KTopbarLoggedOut from '@/components/Layout/LoggedOut/KTopbar'
import KFooter from '@/components/Layout/KFooter'
import MobileNavigation from '@/components/Layout/MobileNavigation'
import MobileSidenav from '@/components/Layout/MobileSidenav'
import MainAlerts from '@/components/Layout/MainAlerts'
import { QLayout, QBtn } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: { KTopbar, KTopbarLoggedOut, KFooter, MobileNavigation, MobileSidenav, QLayout, QBtn, MainAlerts },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
    }),
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
  background-image url('../assets/repeating_grey.jpg')
  background-size: 600px
  background-attachment:fixed
</style>
