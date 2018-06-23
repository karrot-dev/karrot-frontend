<template>
  <div>
    <UnsupportedBrowserWarning
      class="fixed-bottom"
      style="z-index: 9999"
    />

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
              <i class="fas fa-bars" />
            </q-btn>
          </KTopbar>
          <KTopbarLoggedOut v-if="!isLoggedIn" />
        </q-layout-header>
        <q-layout-drawer
          v-if="!$q.platform.is.mobile"
          side="left"
          :breakpoint="0"
          :value="true"
          :overlay="false"
        >
          <router-view
            class="sidenav-desktop"
            name="sidenav"
          />
        </q-layout-drawer>
        <q-layout-drawer
          v-if="$q.platform.is.mobile && isLoggedIn"
          side="left"
          v-model="showSidenav"
          :breakpoint="defaultShowSidenavWidth"
        >
          <MobileSidenav @toggleSidenav="toggleSidenav" />
        </q-layout-drawer>
        <q-page-container>
          <Banners />
          <router-view name="fullPage"/>
          <div class="mainContent row justify-between no-wrap">
            <div class="mainContent-page">
              <router-view />
            </div>
          </div>
          <KFooter v-if="$q.platform.is.mobile && !isLoggedIn" />
        </q-page-container>
        <q-layout-drawer
          v-if="!$q.platform.is.mobile"
          side="right"
          :overlay="false"
          :breakpoint="0"
          :value="showSidenavRight"
        >
          <Detail @close="clearDetail"/>
        </q-layout-drawer>
        <q-layout-footer>
          <template v-if="$q.platform.is.mobile && !$keyboard.is.open">
            <MobileNavigation v-if="isLoggedIn" />
            <UnsupportedBrowserWarning />
          </template>
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
import Banners from '@/components/Layout/Banners'
import RouteError from '@/components/RouteError'
import UnsupportedBrowserWarning from '@/components/UnsupportedBrowserWarning'
import Detail from '@/components/General/Detail'
import { QLayout, QLayoutHeader, QLayoutDrawer, QLayoutFooter, QPageContainer, QWindowResizeObservable, QBtn } from 'quasar'
import { mapGetters, mapActions } from 'vuex'

export default {
  components: {
    Detail, KTopbar, KTopbarLoggedOut, KFooter, MobileNavigation, MobileSidenav, QLayout, QLayoutHeader, QLayoutDrawer, QLayoutFooter, QPageContainer, QWindowResizeObservable, QBtn, Banners, RouteError, UnsupportedBrowserWarning,
  },
  data () {
    return {
      showSidenav: false,
    }
  },
  methods: {
    ...mapActions({
      clearDetail: 'detail/clear',
    }),
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
      showSidenavRight: 'detail/isActive',
    }),
    layoutView () {
      if (this.$q.platform.is.mobile) {
        return 'hHh LpR fFf'
      }
      return 'hHh LpR lfr'
    },
    defaultShowSidenavWidth () {
      return 992
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
    max-width: 65em
    margin-bottom 4.5em
    margin-left 1em
    margin-top 1em
    /*margin-left auto*/
    /*margin-right auto*/
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
