<template>
  <div>
    <UnsupportedBrowserWarning
      class="fixed-bottom"
      style="z-index: 9999"
    />

    <RouteError
      v-if="hasError"
    />

    <div
      v-else
      class="background mainLayoutDesktop"
      :class="theme"
    >
      <QLayout :view="layoutView">
        <QHeader reveal>
          <KTopbar
            v-if="isLoggedIn"
            @toggle-sidenav="toggleSidenav"
          >
            <QBtn
              flat
              class="mobile-only"
              @click="toggleSidenav"
            >
              <i class="fas fa-bars relative-position">
                <div
                  v-if="hasUnseen"
                  class="k-highlight-dot bg-secondary"
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
          <PluginComponent name="SidenavFooter">
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
          </PluginComponent>
          <QItem
            clickable
            @click="logout()"
          >
            <QItemSection side>
              <QIcon
                size="1em"
                name="fas fa-sign-out-alt fa-fw"
              />
            </QItemSection>
            <QItemSection>
              {{ $t('TOPBAR.LOGOUT') }}
            </QItemSection>
          </QItem>
        </QDrawer>

        <!-- desktop sidenav -->
        <QDrawer
          v-else-if="isLoggedIn && currentGroupId && hasSidenavComponent && !disableDesktopSidenav"
          side="left"
          :width="sidenavWidth"
          :breakpoint="0"
          :model-value="true"
          :overlay="false"
          elevated
          @click="toggleSidenav"
        >
          <RouterView name="sidenav" />
          <PluginComponent name="SidenavFooter">
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
          </PluginComponent>
        </QDrawer>

        <QPageContainer>
          <!-- on mobile the banners take up lots of space so only show them on group wall page -->
          <Banners v-if="!$q.platform.is.mobile || isGroupWall" />
          <QPage
            class="mainContent-page"
            :class="{fullpage}"
          >
            <RouterView
              v-if="$q.platform.is.mobile && hasDetailComponent"
              name="detail"
            />
            <RouterView v-else />
          </QPage>
        </QPageContainer>

        <QDrawer
          v-if="!$q.platform.is.mobile && isLoggedIn"
          side="right"
          :width="detailWidth"
          :overlay="false"
          :breakpoint="0"
          elevated
          :model-value="isDetailActive || hasDetailComponent"
        >
          <DetailSidebar v-if="isDetailActive" />
          <RouterView
            v-else-if="hasDetailComponent"
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
} from 'quasar'
import { computed } from 'vue'
import { useRoute } from 'vue-router'

import { useLogoutMutation } from '@/authuser/mutations'
import { useAuthService } from '@/authuser/services'
import { useRouteErrorService } from '@/base/services'
import { useCurrentGroupService } from '@/group/services'
import { useDetailService } from '@/messages/services'
import { useStatusService } from '@/status/services'

import Banners from '@/alerts/components/Banners.vue'
import KAbout from '@/base/components/KAbout.vue'
import PluginComponent from '@/base/components/PluginComponent.vue'
import RouteError from '@/base/components/RouteError.vue'
import UnsupportedBrowserWarning from '@/base/components/UnsupportedBrowserWarning.vue'
import CommunityFeed from '@/communityFeed/components/CommunityFeed.vue'
import KarrotLogo from '@/logo/components/KarrotLogo.vue'
import DetailSidebar from '@/messages/components/DetailSidebar.vue'
import SidenavTitle from '@/sidenav/components/SidenavTitle.vue'
import KTopbar from '@/topbar/components/KTopbar.vue'
import KTopbarLoggedOut from '@/topbar/components/LoggedOut/KTopbar.vue'

export default {
  components: {
    PluginComponent,
    KarrotLogo,
    QDialog,
    DetailSidebar,
    KAbout,
    KTopbar,
    KTopbarLoggedOut,
    SidenavTitle,
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
    Banners,
    RouteError,
    UnsupportedBrowserWarning,
    CommunityFeed,
  },
  setup () {
    const { isLoggedIn } = useAuthService()
    const { isDetailActive } = useDetailService()
    const { mutate: logout } = useLogoutMutation()

    const { hasError } = useRouteErrorService()

    const {
      groupId: currentGroupId,
      isBikeKitchen,
      isGeneralPurpose,
    } = useCurrentGroupService()

    const {
      unseenCount,
      unseenNotificationCount,
    } = useStatusService()

    const hasUnseen = computed(() => unseenCount.value > 0 || unseenNotificationCount.value > 0)

    const route = useRoute()

    const disableDesktopSidenav = computed(() => route.meta.disableDesktopSidenav)

    const isGroupWall = computed(() => route.name === 'group')

    return {
      logout,
      hasError,
      isGroupWall,
      isDetailActive,
      isLoggedIn,
      currentGroupId,
      isBikeKitchen,
      isGeneralPurpose,
      hasUnseen,
      disableDesktopSidenav,
    }
  },
  data () {
    return {
      showSidenav: false,
      showAbout: false,
    }
  },
  computed: {
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
    theme () {
      if (this.isBikeKitchen) return 'bikekitchen'
      if (this.isGeneralPurpose) return 'general'
      return ''
    },
  },
  methods: {
    toggleSidenav () {
      this.showSidenav = !this.showSidenav
    },
    toggleAbout () {
      this.showAbout = !this.showAbout
    },
  },
}
</script>

<style scoped lang="sass">
.mainContent-page
  width: 100%

.sidenav-desktop
  width: 30%
  min-width: 250px
  max-width: 30em
  margin-right: .4em
  margin-left: auto

body.desktop .mainContent-page:not(.fullpage)
  min-width: 350px
  max-width: 57em
  margin-top: 8px
  margin-right: auto
  margin-bottom: 4.5em
  margin-left: auto

.background
  background-image: url('../assets/repeating_grey-600.png')
  background-attachment: fixed

  &.bikekitchen
    background-image: url('../assets/bikekitchen_background.jpg')

  &.general
    background-image: url('../assets/general_background.jpg')

.k-highlight-dot
  position: absolute
  right: -4px
  bottom: -4px
  width: .5rem
  height: .5rem
  border-radius: 50%

.logo
  width: auto
  height: 19px
</style>

<style lang="sass">
@media screen and (max-width: $breakpoint-lg)
  .sidenav-desktop > .q-card
    margin: 5px 0
</style>
