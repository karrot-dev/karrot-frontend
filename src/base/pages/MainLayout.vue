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
      <QLayout :view="layoutView">
        <QLayoutHeader reveal>
          <KTopbar
            v-if="isLoggedIn"
            @toggleSidenav="toggleSidenav"
          >
            <QBtn
              flat
              @click="toggleSidenav"
              class="mobile-only"
            >
              <i class="fas fa-bars relative-position">
                <div
                  v-if="hasNotification"
                  class="k-highlight-dot"
                  :class="hasImportantNotification ? 'bg-secondary' : 'bg-grey'"
                />
              </i>
            </QBtn>
          </KTopbar>
          <KTopbarLoggedOut v-if="!isLoggedIn" />
          <RouterView name="subheader" />
        </QLayoutHeader>

        <!-- mobile sidenav -->
        <QLayoutDrawer
          v-if="$q.platform.is.mobile"
          side="left"
          :width="sidenavWidth"
          :breakpoint="Number.MAX_SAFE_INTEGER"
          v-model="showSidenav"
          :overlay="false"
          @click.native="toggleSidenav"
        >
          <SidenavTitle @click="toggleSidenav" />
          <RouterView name="sidenav" />
          <MobileSidenav/>
          <QItem
            link
            @click.native="toggleAbout()"
          >
            <QItemSide class="text-center">
              <KarrotLogo
                disable-loading
                class="logo"
              />
            </QItemSide>
            <QItemMain>
              {{ $t("GLOBAL.ABOUT_KARROT") }}
            </QItemMain>
          </QItem>
        </QLayoutDrawer>

        <!-- desktop sidenav -->
        <QLayoutDrawer
          v-else-if="isLoggedIn && currentGroup && hasSidenavComponent && !disableDesktopSidenav"
          side="left"
          :width="sidenavWidth"
          :breakpoint="0"
          :value="true"
          :overlay="false"
          @click.native="toggleSidenav"
        >
          <RouterView name="sidenav" />
          <QItem
            link
            @click.native="toggleAbout()"
          >
            <QItemSide class="text-center">
              <KarrotLogo
                disable-loading
                class="logo"
              />
            </QItemSide>
            <QItemMain>
              {{ $t("GLOBAL.ABOUT_KARROT") }}
            </QItemMain>
          </QItem>
        </QLayoutDrawer>

        <QPageContainer>
          <Banners />
          <RouterView name="fullPage"/>
          <div class="mainContent row justify-between no-wrap">
            <div class="mainContent-page">
              <Component
                :is="disablePullToRefresh ? 'div' : 'QPullToRefresh'"
                :handler="refresh"
                style="max-height: none"
              >
                <RouterView />
              </Component>
            </div>
          </div>
        </QPageContainer>
        <QLayoutDrawer
          v-if="!$q.platform.is.mobile"
          side="right"
          :width="400"
          :overlay="false"
          :breakpoint="0"
          :value="showRightDrawer"
        >
          <DetailSidebar @close="clearDetail"/>
        </QLayoutDrawer>
        <QWindowResizeObservable @resize="onResize" />
      </QLayout>
    </div>

    <QModal v-model="showAbout">
      <KAbout @close="toggleAbout()"/>
    </QModal>
  </div>
</template>

<script>
import KTopbar from '@/topbar/components/KTopbar'
import KTopbarLoggedOut from '@/topbar/components/LoggedOut/KTopbar'
import KAbout from '@/base/components/KAbout'
import SidenavTitle from '@/sidenav/components/SidenavTitle'
import MobileSidenav from '@/sidenav/components/MobileSidenav'
import Banners from '@/alerts/components/Banners'
import RouteError from '@/base/components/RouteError'
import UnsupportedBrowserWarning from '@/base/components/UnsupportedBrowserWarning'
import DetailSidebar from '@/messages/components/DetailSidebar'
import KarrotLogo from '@/logo/components/KarrotLogo'
import { mapGetters, mapActions } from 'vuex'
import {
  dom,
  QLayout,
  QLayoutHeader,
  QLayoutDrawer,
  QLayoutFooter,
  QModal,
  QPageContainer,
  QWindowResizeObservable,
  QItem,
  QIcon,
  QItemMain,
  QItemSide,
  QBtn,
  QPullToRefresh,
} from 'quasar'

const { width } = dom

export default {
  components: {
    KarrotLogo,
    QModal,
    DetailSidebar,
    KAbout,
    KTopbar,
    KTopbarLoggedOut,
    SidenavTitle,
    MobileSidenav,
    QLayout,
    QLayoutHeader,
    QLayoutDrawer,
    QLayoutFooter,
    QPageContainer,
    QWindowResizeObservable,
    QBtn,
    QIcon,
    QItem,
    QItemMain,
    QItemSide,
    QPullToRefresh,
    Banners,
    RouteError,
    UnsupportedBrowserWarning,
  },
  data () {
    return {
      showSidenav: false,
      showAbout: false,
      windowWidth: width(window),
    }
  },
  methods: {
    ...mapActions({
      clearDetail: 'detail/clear',
      refresh: 'refresh/refresh',
    }),
    toggleSidenav () {
      this.showSidenav = !this.showSidenav
    },
    toggleAbout () {
      this.showAbout = !this.showAbout
    },
    onResize ({ width }) {
      this.windowWidth = width
    },
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      routeError: 'routeError/status',
      showRightDrawer: 'detail/isActive',
      disableDesktopSidenav: 'route/disableDesktopSidenav',
      messagesUnseenCount: 'latestMessages/unseenCount',
      messagesAllUnreadMuted: 'latestMessages/allUnreadMuted',
      notificationsUnseenCount: 'notifications/unseenCount',
      currentGroup: 'currentGroup/value',
    }),
    layoutView () {
      if (this.$q.platform.is.mobile) {
        return 'hHh LpR fFf'
      }
      return 'hHh LpR lfr'
    },
    sidenavWidth () {
      if (this.$q.platform.is.mobile) {
        return Math.min(380, this.windowWidth)
      }
      return this.windowWidth > 1000 ? 380 : 280
    },
    routerComponents () {
      const components = {}
      for (const m of this.$route.matched) {
        for (const name of Object.keys(m.components)) {
          components[name] = true
        }
      }
      return components
    },
    hasSidenavComponent () {
      return Boolean(this.routerComponents.sidenav)
    },
    hasNotification () {
      return this.messagesUnseenCount > 0 || this.notificationsUnseenCount > 0
    },
    hasImportantNotification () {
      return !this.messagesAllUnreadMuted || this.notificationsUnseenCount > 0
    },
    disablePullToRefresh () {
      if (!this.$q.platform.is.mobile) return true
      if (this.$route.matched.some(({ meta }) => meta && meta.disablePullToRefresh)) return true
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
.background
  background-image url('../assets/repeating_grey.png')
  background-size: 600px
  background-attachment:fixed
.q-layout-footer
  box-shadow none
.k-highlight-dot
  position absolute
  right -4px
  bottom -4px
  width .5rem
  height .5rem
  border-radius 50%
.logo
  height 25px
</style>

<style lang="stylus">
@import '~variables'

@media screen and (max-width: $breakpoint-lg)
  .sidenav-desktop > .q-card
    margin 5px 0
</style>
