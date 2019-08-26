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
      :class="theme"
    >
      <QLayout :view="layoutView">
        <QHeader reveal>
          <KTopbar
            v-if="isLoggedIn"
            @toggleSidenav="toggleSidenav"
          >
            <QBtn
              flat
              class="mobile-only"
              @click="toggleSidenav"
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
        </QHeader>

        <!-- mobile sidenav -->
        <QDrawer
          v-if="$q.platform.is.mobile"
          v-model="showSidenav"
          side="left"
          :breakpoint="Number.MAX_SAFE_INTEGER"
          overlay
          elevated
        >
          <SidenavTitle @click="toggleSidenav" />
          <RouterView name="sidenav" />
          <MobileSidenav />
          <QItem
            clickable
            @click="toggleAbout"
          >
            <QItemSection
              side
              class="text-center"
            >
              <KarrotLogo class="logo" />
            </QItemSection>
            <QItemSection>
              {{ $t("GLOBAL.ABOUT_KARROT") }}
            </QItemSection>
          </QItem>
          <CommunityFeed />
        </QDrawer>

        <!-- desktop sidenav -->
        <QDrawer
          v-else-if="isLoggedIn && currentGroupId && hasSidenavComponent && !disableDesktopSidenav"
          side="left"
          :width="sidenavWidth"
          :breakpoint="0"
          :value="true"
          :overlay="false"
          elevated
          @click.native="toggleSidenav"
        >
          <RouterView name="sidenav" />
          <QItem
            clickable
            @click="toggleAbout"
          >
            <QItemSection
              side
              class="text-center"
            >
              <KarrotLogo class="logo" />
            </QItemSection>
            <QItemSection>
              {{ $t("GLOBAL.ABOUT_KARROT") }}
            </QItemSection>
          </QItem>
          <CommunityFeed />
        </QDrawer>

        <QPageContainer>
          <Banners />
          <QPage
            class="mainContent-page"
            :class="{fullpage}"
          >
            <Component
              :is="disablePullToRefresh ? 'div' : 'QPullToRefresh'"
              style="max-height: none"
              @refresh="refresh"
            >
              <RouterView
                v-if="$q.platform.is.mobile && hasDetailComponent"
                name="detail"
              />
              <RouterView v-else />
            </Component>
          </QPage>
        </QPageContainer>

        <QDrawer
          v-if="!$q.platform.is.mobile"
          side="right"
          :width="detailWidth"
          :overlay="false"
          :breakpoint="0"
          elevated
          :value="isDetailActive || hasDetailComponent"
        >
          <DetailSidebar
            v-if="isDetailActive"
            @close="clearDetail"
          />
          <RouterView
            v-else
            name="detail"
          />
        </QDrawer>

        <QFooter>
          <RouterView name="footer" />
          <UnsupportedBrowserWarning
            v-if="$q.platform.is.mobile && !$keyboard.is.open"
          />
        </QFooter>
      </QLayout>
    </div>

    <QDialog v-model="showAbout">
      <KAbout @close="toggleAbout" />
    </QDialog>
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
import CommunityFeed from '@/communityFeed/components/CommunityFeed'

import { mapGetters, mapActions } from 'vuex'
import {
  QLayout,
  QHeader,
  QDrawer,
  QFooter,
  QDialog,
  QPageContainer,
  QPage,
  QItem,
  QIcon,
  QItemSection,
  QBtn,
  QPullToRefresh,
} from 'quasar'

export default {
  components: {
    KarrotLogo,
    QDialog,
    DetailSidebar,
    KAbout,
    KTopbar,
    KTopbarLoggedOut,
    SidenavTitle,
    MobileSidenav,
    QLayout,
    QHeader,
    QDrawer,
    QFooter,
    QPageContainer,
    QPage,
    QBtn,
    QIcon,
    QItem,
    QItemSection,
    QPullToRefresh,
    Banners,
    RouteError,
    UnsupportedBrowserWarning,
    CommunityFeed,
  },
  data () {
    return {
      showSidenav: false,
      showAbout: false,
    }
  },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      routeError: 'routeError/status',
      isDetailActive: 'detail/isActive',
      disableDesktopSidenav: 'route/disableDesktopSidenav',
      messagesUnseenCount: 'latestMessages/unseenCount',
      messagesAllUnreadMuted: 'latestMessages/allUnreadMuted',
      notificationsUnseenCount: 'notifications/unseenCount',
      currentGroupId: 'currentGroup/id',
      isBikeKitchen: 'currentGroup/isBikeKitchen',
      isGeneralPurpose: 'currentGroup/isGeneralPurpose',
    }),
    layoutView () {
      if (this.$q.platform.is.mobile) {
        return 'hHh LpR fFf'
      }
      return 'hHh LpR lfr'
    },
    sidenavWidth () {
      if (this.$q.platform.is.mobile) {
        return Math.min(380, this.$q.screen.width)
      }
      return this.$q.screen.width > 1000 ? 380 : 280
    },
    detailWidth () {
      const contentWidth = this.$q.screen.width - this.sidenavWidth
      const columnWidth = Math.floor(contentWidth / 2)
      return Math.min(500, Math.max(280, columnWidth))
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
    fullpage () {
      return this.$route.matched.some(m => m.meta.fullpage)
    },
    hasSidenavComponent () {
      return Boolean(this.routerComponents.sidenav)
    },
    hasDetailComponent () {
      return this.$route.matched.some(({ meta }) => meta && meta.isDetail === true)
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
    theme () {
      if (this.isBikeKitchen) return 'bikekitchen'
      if (this.isGeneralPurpose) return 'general'
      return ''
    },
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
body.desktop .mainContent-page:not(.fullpage)
  min-width 350px
  max-width: 57em
  margin-bottom 4.5em
  margin-left auto
  margin-right auto
.background
  background-image url('../assets/repeating_grey.png')
  background-size: 600px
  background-attachment:fixed
  &.bikekitchen
    background-image url('../assets/bikekitchen_background.jpg')
  &.general
    background-image url('../assets/general_background.jpg')
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
