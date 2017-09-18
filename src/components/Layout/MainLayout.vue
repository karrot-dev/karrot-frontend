<template>
    <div class="background mainLayoutDesktop">
      <q-layout class="wrapper" ref="layout" :view="layoutView" :right-breakpoint="1100">
        <div slot="header">

          <KTopbar slot="header">
            <q-btn slot="left" flat @click="$refs.layout.toggleLeft()">
              <i class="fa fa-bars"></i>
            </q-btn>
          </KTopbar>
        </div>
        <template slot="left" v-if="$q.platform.is.mobile">
          <q-list no-border link inset-separator>
            <q-list-header>Essential Links</q-list-header>
            <q-side-link item to="/docs">
              <q-item-side icon="school" />
              <q-item-main label="Docs" sublabel="quasar-framework.org" />
            </q-side-link>
            <q-side-link item :to="{name: 'settings'}">
              <q-item-side icon="record_voice_over" />
              <q-item-main label="Settings" />
            </q-side-link>
            <q-side-link item to="/chat">
              <q-item-side icon="chat" />
              <q-item-main label="Git" sublabel="Quasar Lobby" />
            </q-side-link>
            <q-side-link item to="/twitter">
              <q-item-side icon="rss feed" />
              <q-item-main label="Logout" sublabel="@quasarframework" />
            </q-side-link>
          </q-list>
        </template>
        <div class="mainContent row justify no-wrap">
          <div class="whiteSpace gt-sm"/>
          <div class="desktop-only sidenav-desktop">
            <slot name="sidenav-desktop"/>
          </div>
          <div class="whiteSpaceSmall gt-sm"/>
          <div class="mainContent-page">
            <slot>Content</slot>
            <q-btn flat @click="$refs.layout.toggleLeft()">
              <i class="fa fa-bars on-left"></i>Open Sidenav
            </q-btn>
          </div>
          <div class="whiteSpace gt-sm"/>
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
import { QLayout, QBtn, QList, QListHeader, QSideLink, QItemSide, QItemMain } from 'quasar'

export default {
  components: { KTopbar, KFooter, MobileNavigation, QLayout, QBtn, QList, QListHeader, QSideLink, QItemSide, QItemMain },
  computed: {
    layoutView () {
      console.log(this.$q.platform.is.mobile)
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
  margin-right 2em
  width 30%
  min-width 250px
body.desktop .mainContent-page
  min-width 400px
body.mobile .mainContent-page
  width 100%
.whiteSpace
  width 5%
.whiteSpaceSmall
  width 2%
</style>
