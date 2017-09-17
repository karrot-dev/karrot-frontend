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
    <KBreadcrumb class="bread" :breadcrumbs="['FS Darmstadt', 'Edeka Arheilgen']"/>
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
<!--
  <div class="row justify-between no-wrap toolbar">
    <slot name="left"/>
    <div class="logo">
      <KarrotLogo/>
    </div>
    <KBreadcrumb class="bread" :breadcrumbs="['FS Darmstadt', 'Edeka Arheilgen']"/>
    <div>
      <q-btn flat>
        <q-icon size="1em" name="fa-comment" />
      </q-btn>
      <q-btn flat>
        <q-icon size="1em" name="fa-bell" />
      </q-btn>
      <q-btn flat>
        <q-icon size="1em" name="fa-user" />
        <q-popover fit ref="popover">
          <q-list item-separator link>
            <q-item @click="doSomething(), $refs.popover.close()">
              <i class="fa-user fa-fw on-left"/>
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
    </div>
  </div>
  -->
</template>

<script>
import { QToolbar, QToolbarTitle, QBtn, QIcon, QPopover, QList, QItem } from 'quasar'
import KarrotLogo from './KarrotLogo'
import KBreadcrumb from '@/components/General/KBreadcrumb'

export default {
  components: {
    QToolbar, QToolbarTitle, QBtn, QIcon, QPopover, QList, QItem, KarrotLogo, KBreadcrumb,
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.logo
  margin-left 1em
  height 36px
</style>
