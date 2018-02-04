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
        <div slot="header">
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
        </div>
        <template
          slot="left"
          v-if="$q.platform.is.mobile && isLoggedIn"
        >
          <MobileSidenav @toggleSidenav="$refs.layout.toggleLeft()" />
        </template>
        <MainAlerts />
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

        <MobileNavigation
          v-if="$q.platform.is.mobile && isLoggedIn && !$keyboard.is.open"
          slot="footer"
        />
        <KFooter
          v-if="!$q.platform.is.mobile"
          slot="footer"
        />
      </q-layout>
      <span
        v-if="!$q.platform.is.mobile && isLoggedIn"
        class="chat-floater row items-end no-wrap ">
        <ChatFloater
          v-for="floater in chatFloaters.slice().reverse()"
          v-if="$route.name !== 'chat' && $route.name !== 'chatDetail'"
          :key="floater.id"
          :is-open="floater.isOpen"
          :conversation-id="floater.id"/>
      </span>
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
import ChatFloater from '@/components/Conversation/ChatFloater'
import RouteError from '@/components/RouteError'
import { QLayout, QBtn } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: { KTopbar, ChatFloater, KTopbarLoggedOut, KFooter, MobileNavigation, MobileSidenav, QLayout, QBtn, MainAlerts, RouteError },
  computed: {
    ...mapGetters({
      isLoggedIn: 'auth/isLoggedIn',
      routeError: 'routeError/status',
      chatFloaters: 'chatFloaters/all',
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

.chat-floater
  position fixed
  right 0
  bottom 0
  z-index 100000
</style>

<style lang="stylus">
@import '~variables'

@media screen and (max-width: $breakpoint-lg)
  .sidenav-desktop > .q-card
    margin 5px 0
</style>
