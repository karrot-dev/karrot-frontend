<template>
  <div>
    <template v-if="routeError.hasError">
      <RouteError>
        <p v-if="routeError.message" class="caption text-center">
          <span v-if="routeError.message.translation" v-t="routeError.message.translation" />
        </p>
      </RouteError>
    </template>
    <div v-else class="background mainLayoutDesktop">
      <q-layout :reveal="$q.platform.is.mobile" class="wrapper" ref="layout" :view="layoutView" :right-breakpoint="1100">
        <div slot="header">
          <KTopbar @toggleSidenav="$refs.layout.toggleLeft()" v-if="isLoggedIn">
            <q-btn flat @click="$refs.layout.toggleLeft()" class="mobile-only">
              <i class="fa fa-bars" />
            </q-btn>
          </KTopbar>
          <KTopbarLoggedOut v-if="!isLoggedIn" />
        </div>
        <template slot="left" v-if="$q.platform.is.mobile && isLoggedIn">
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
        <KFooter v-if="$q.platform.is.mobile && !isLoggedIn" />

        <MobileNavigation v-if="$q.platform.is.mobile && isLoggedIn && !$keyboard.is.open" slot="footer" />
        <KFooter v-if="!$q.platform.is.mobile" slot="footer" />
      </q-layout>
    </div>
  </div>
</template>

<script>

import KTopbar from '@/components/Layout/KTopbar'
import KTopbarLoggedOut from '@/components/Layout/LoggedOut/KTopbar'
import KFooter from '@/components/Layout/KFooter'
import MobileNavigation from '@/components/Layout/MobileNavigation'
import MobileSidenav from '@/components/Layout/MobileSidenav'
import MainAlerts from '@/components/Layout/MainAlerts'
import RouteError from '@/components/RouteError'
import { QLayout, QBtn } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: { KTopbar, KTopbarLoggedOut, KFooter, MobileNavigation, MobileSidenav, QLayout, QBtn, MainAlerts, RouteError },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      routeError: 'routeError/status',
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
  margin-bottom 4.5em
.whiteSpace
  width 5%

.background
  background-image url('../assets/repeating_grey.jpg')
  background-size: 600px
  background-attachment:fixed
</style>
