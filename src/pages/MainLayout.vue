<template>
  <div v-if="browserDetect">
    <p> {{ $t('OUTDATED.FIRST_MESSAGE') }} <a
      href="https://browser-update.org/update.html"
      class="outdated"
      rel="noopener"
      target="_blank"
      translate="yes">{{ $t('OUTDATED.LINK') }}</a> {{ $t('OUTDATED.SECOND_MESSAGE') }}</p>
  </div>
  <div v-else>
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
      <q-layout :view="layoutView">
        <q-layout-header reveal>
          <KTopbar
            v-if="isLoggedIn"
            @toggleSidenav="toggleSidenav"
          >
            <q-btn
              flat
              @click="toggleSidenav"
              class="mobile-only"
            >
              <i class="fa fa-bars" />
            </q-btn>
          </KTopbar>
          <KTopbarLoggedOut v-if="!isLoggedIn" />
        </q-layout-header>
        <q-layout-drawer
          v-if="$q.platform.is.mobile && isLoggedIn"
          side="left"
          v-model="showSidenav"
          :breakpoint="defaultShowSidenavWidth"
        >
          <MobileSidenav @toggleSidenav="toggleSidenav" />
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
        <q-window-resize-observable @resize="onResize" />
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
import { QLayout, QLayoutHeader, QLayoutDrawer, QLayoutFooter, QPageContainer, QWindowResizeObservable, QBtn } from 'quasar'
import { mapGetters } from 'vuex'
import browser from 'browser-detect'

export default {
  components: {
    KTopbar, KTopbarLoggedOut, KFooter, MobileNavigation, MobileSidenav, QLayout, QLayoutHeader, QLayoutDrawer, QLayoutFooter, QPageContainer, QWindowResizeObservable, QBtn, MainAlerts, RouteError,
  },
  data () {
    return {
      showSidenav: false,
    }
  },
  methods: {
    toggleSidenav () {
      this.showSidenav = !this.showSidenav
    },
    onResize ({ width }) {
      if (width >= this.defaultShowSidenavWidth) {
        this.showSidenav = true
      }
    },
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      routeError: 'routeError/status',
    }),
    layoutView () {
      if (this.$q.platform.is.mobile) {
        return 'hHh LpR fFf'
      }
      return 'hHh LpR fff'
    },
    defaultShowSidenavWidth () {
      return 992
    },
    browserDetect () {
      const result = browser()
      if (result.name === 'safari' && result.versionNumber < 9.1) {
        return true
      }
      else if (result.name === 'ie' && result.versionNumber < 11) {
        return true
      }
      return false
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
.outdated
  color #0000EE
  text-decoration underline
.background
  background-image url('../assets/repeating_grey.jpg')
  background-size: 600px
  background-attachment:fixed
.q-layout-footer
  box-shadow none
</style>

<style lang="stylus">
@import '~variables'

@media screen and (max-width: $breakpoint-lg)
  .sidenav-desktop > .q-card
    margin 5px 0
</style>
