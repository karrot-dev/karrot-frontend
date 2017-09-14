<template>
  <div class="row justify-between toolbar">
    <div class="logo">
      <KarrotLogo/>
    </div>
    <div>
      <q-btn flat>
        <q-icon size="1em" name="fa-comment" />
      </q-btn>
      <q-btn flat>
        <q-icon size="1em" name="fa-bell" />
      </q-btn>
      <q-btn flat>
        <q-icon size="1em" name="fa-user" />
        <!-- Direct child of target -->
        <q-popover fit ref="popover">
          <!--
            The DOM element(s) that make up the popup,
            in this case a list:
          -->
          <q-list item-separator link>
            <q-item @click="doSomething(), $refs.popover.close()">
              <q-icon size="1em" name="fa-user fa-fw" />
              View Profile
            </q-item>
            <q-item @click="doSomething(), $refs.popover.close()">              
              <q-icon size="1em" name="fa-cog fa-fw" />
              Settings
            </q-item>
            <q-item @click="doSomething(), $refs.popover.close()">
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

export default {
  components: {
    QBtn, QIcon, QPopover, QList, QItem, KarrotLogo
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
    margin-left .5em
    height 36px
</style>