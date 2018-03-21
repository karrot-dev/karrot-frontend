<template>
  <div>
    <template v-if="routeError.hasError">
      <RouteError>
        <p
          v-if="routeError.message"
          class="caption text-center"
        >
          <span
            v-if="routeError.message.translation"
            v-t="routeError.message.translation"
          />
        </p>
      </RouteError>
    </template>

    <div
      v-else
      class="background mainLayoutDesktop"
    >
      <q-layout
        :reveal="$q.platform.is.mobile"
        class="wrapper"
        ref="layout"
        :view="layoutView"
        :right-breakpoint="1100"
      >
        <q-layout-header>
          <KTopbar
            @toggleSidenav="$refs.layout.toggleLeft()"
            v-if="isLoggedIn"
          >
            <q-btn
              flat
              @click="$refs.layout.toggleLeft()"
              class="mobile-only"
            >
              <i class="fa fa-bars" />
            </q-btn>
          </KTopbar>
          <KTopbarLoggedOut v-if="!isLoggedIn" />
        </q-layout-header>
        <q-layout-drawer v-if="$q.platform.is.mobile && isLoggedIn">
          <MobileSidenav @toggleSidenav="$refs.layout.toggleLeft()" />
        </q-layout-drawer>
        <q-page-container>
          <MainAlerts />
          <router-view name="fullPage"/>
          <div class="mainContent row justify-between no-wrap">
            <router-view
              v-if="!$q.platform.is.mobile"
              class="sidenav-desktop"
              name="sidenav"
            />
            <div class="mainContent-page">
              <router-view />
            </div>
          </div>
          <KFooter v-if="$q.platform.is.mobile && !isLoggedIn" />
        </q-page-container>
        <q-layout-footer>
          <MobileNavigation v-if="$q.platform.is.mobile && isLoggedIn && !$keyboard.is.open" />
          <KFooter v-if="!$q.platform.is.mobile" />
        </q-layout-footer>
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
import { QLayout, QLayoutHeader, QLayoutDrawer, QLayoutFooter, QPageContainer, QBtn } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: {
    KTopbar, KTopbarLoggedOut, KFooter, MobileNavigation, MobileSidenav, QLayout, QLayoutHeader, QLayoutDrawer, QLayoutFooter, QPageContainer, QBtn, MainAlerts, RouteError },
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
@import '~variables'
.mainContent-page
  width 100%
.sidenav-desktop
  width 30%
  min-width 250px
  max-width 30em
  margin-left auto
  margin-right .4em
body.desktop .mainContent
  max-width 1500px
  margin auto
  .mainContent-page
    min-width 350px
    max-width: 57em
    margin-bottom 4.5em
    margin-left auto
    margin-right auto
.background
  background-image url('../assets/repeating_grey.jpg')
  background-size: 600px
  background-attachment:fixed
</style>

<style lang="stylus">
@import '~variables'

@media screen and (max-width: $breakpoint-lg)
  .sidenav-desktop > .q-card
    margin 5px 0
</style>
