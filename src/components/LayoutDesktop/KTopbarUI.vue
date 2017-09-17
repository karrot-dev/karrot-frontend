<template>
  <div class="row justify-between toolbar">
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
</template>

<script>
import { QBtn, QIcon, QPopover, QList, QItem } from 'quasar'
import KarrotLogo from './KarrotLogo'
import KBreadcrumb from '@/components/General/KBreadcrumb'

export default {
  components: {
    QBtn, QIcon, QPopover, QList, QItem, KarrotLogo, KBreadcrumb
  }
}
</script>

<style scoped lang="stylus">
@import '~variables'
.toolbar
  background-color $primary
  padding .2em
  color white
  width 100%
  height: 42px
  .logo
    margin-left 2em
    height 36px
  .bread
    margin auto
</style>
