<template>
  <q-toolbar color="primary">
    <!--
      For Toolbar title, we use
      QToolbarTitle component
    -->            
    <!--<q-btn slot="left" flat @click="$refs.left.open()">
      <i class="fa fa-bars"></i>
    </q-btn>-->
    <router-link :to="{name: 'group'}" class="logo">
      <KarrotLogo/>
    </router-link>
    <q-toolbar-title>
      <div class="row justify-between">
        <div></div>
        <KBreadcrumb class="bread" :breadcrumbs="breadcrumbs"/>
        <div></div>
      </div>
    </q-toolbar-title>

    <q-btn flat class="mobile-only">
      <q-icon name="fa-fw fa-search"/>
    </q-btn>
    <q-btn flat class="desktop-only">
      <q-icon name="fa-fw fa-comment"/>
    </q-btn>
    <q-btn flat class="desktop-only">
      <q-icon name="fa-fw fa-bell" />
    </q-btn>
    <q-btn flat class="desktop-only">
      <q-icon name="fa-fw fa-user" />
      <q-popover fit ref="popover">
        <q-list item-separator link>
          <q-item :to="{name: 'user', params: {userId: 72}}" @click="$refs.popover.close()">
            <q-icon size="1em" name="fa-user fa-fw" />
            {{$t('TOPBAR.USERPROFILE')}}
          </q-item>
          <q-item :to="{name: 'settings'}" @click="$refs.popover.close()">
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
import { QToolbar, QToolbarTitle, QBtn, QIcon, QPopover, QList, QItem } from 'quasar'
import KarrotLogo from './KarrotLogo'
import KBreadcrumb from '@/components/General/KBreadcrumb'

export default {
  components: {
    QToolbar, QToolbarTitle, QBtn, QIcon, QPopover, QList, QItem, KarrotLogo, KBreadcrumb,
  },
  props: {
    breadcrumbs: { required: false, default: () => [] },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.logo
  margin-left 1em
  height 36px
</style>
