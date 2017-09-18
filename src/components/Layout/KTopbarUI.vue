<template>
  <q-toolbar color="primary">
    <!--
      For Toolbar title, we use
      QToolbarTitle component
    -->            
    <!--<q-btn slot="left" flat @click="$refs.left.open()">
      <i class="fa fa-bars"></i>
    </q-btn>-->
    <div class="logo">
      <KarrotLogo/>
    </div>
    <q-toolbar-title>
      <KBreadcrumb class="bread" :breadcrumbs="breadcrumbs"/>
    </q-toolbar-title>

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
          <q-item @click="doSomething(), $refs.popover.close()">
            <i class="fa-fw fa-user"/>
            View Profile
          </q-item>
          <q-item @click="doSomething(), $refs.popover.close()">
            <q-icon size="1em" name="fa-cog fa-fw" />
            Settings
          </q-item>
          <q-item @click="$emit('logout'), $refs.popover.close()">
            <q-icon size="1em" name="fa-sign-out fa-fw" />
            Logout
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
