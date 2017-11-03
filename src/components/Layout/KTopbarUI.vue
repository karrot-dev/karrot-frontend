<template>
  <q-toolbar color="primary">
    <q-btn slot="left" flat class="mobile-only" @click="$emit('toggleSidenav')">
      <i class="fa fa-bars"></i>
    </q-btn>
    <router-link v-if="!$q.platform.is.mobile" :to="{name: 'group'}" class="logo">
      <KarrotLogo/>
    </router-link>
    <q-toolbar-title>
      <div class="row justify-between no-wrap">
        <div></div>
        <KBreadcrumb class="bread" :breadcrumbs="breadcrumbs"/>
        <div></div>
      </div>
    </q-toolbar-title>
    <q-transition duration="310" name="search-slide-in" appear>
      <div class="searchbar row no-wrap" v-if="searchOpen">
        <q-btn flat color="primary" @click="$emit('hideSearch')">
          <q-icon name="fa-fw fa-window-close-o"/>
        </q-btn>
        <div>
          <Search style="margin-top: .2em; vertical-align: middle"/>
        </div>
      </div>
    </q-transition>
    <q-btn v-if="!searchOpen" flat @click="$emit('showSearch')">
      <q-icon name="fa-fw fa-search"/>
    </q-btn>
    <router-link :to="{name: 'user', params: {userId: user.id}}" class="defaulthover">
      <q-btn flat class="desktop-only">
        {{ user.displayName }}
        <q-icon name="fa-fw fa-user" />
      </q-btn>
    </router-link>
    <q-btn flat class="desktop-only">
      <q-icon name="fa-fw fa-ellipsis-v" />
      <q-popover :touch-position="false" fit ref="popover">
        <q-list item-separator link>
          <q-item :to="{name: 'groupsGallery'}" @click.native="$refs.popover.close()">
            <q-icon size="1em" name="fa-home fa-fw" />
            {{ $t('TOPBAR.CHANGE_GROUP')  }}
          </q-item>
          <q-item :to="{name: 'settings'}" @click.native="$refs.popover.close()">
            <q-icon size="1em" name="fa-cog fa-fw" />
            {{$t('SETTINGS.TITLE')}}
          </q-item>
          <q-item @click="$emit('logout'), $refs.popover.close()">
            <q-icon size="1em" name="fa-sign-out fa-fw" />
            {{$t('TOPBAR.LOGOUT')}}
          </q-item>
        </q-list>
      </q-popover>
    </q-btn>
  </q-toolbar>
</template>

<script>
import { QTransition, QToolbar, QToolbarTitle, QBtn, QIcon, QPopover, QList, QItem } from 'quasar'
import KarrotLogo from './KarrotLogo'
import KBreadcrumb from '@/components/General/KBreadcrumb'
import Search from '@/components/General/Search'

export default {
  components: {
    QTransition, QToolbar, QToolbarTitle, QBtn, QIcon, QPopover, QList, QItem, KarrotLogo, KBreadcrumb, Search,
  },
  props: {
    breadcrumbs: { required: false, default: () => [] },
    searchOpen: { required: true },
    currentUserId: {},
    user: { required: true },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.logo
  margin-left 1em
  height 36px
.searchbar
  background-color lightgrey
  padding-right .2em
  margin-right .2em
  border-radius $borderRadiusSmall

/* Enter and leave animations can use different */
/* durations and timing functions.              */

.search-slide-in-leave, .search-slide-in-enter-to
  width: 17em

.search-slide-in-leave-active, .search-slide-in-enter-active
  transition: all .3s ease

.search-slide-in-enter, .search-slide-in-leave-to
  width: 0em
  opacity 0

a.defaulthover:hover {
  color: inherit
}
</style>
