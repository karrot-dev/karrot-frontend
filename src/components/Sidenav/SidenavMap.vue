<template>
  <SidenavBox>
    <div slot="name">Map</div>
    <div slot="tools">
      <q-btn flat>
          <i class="fa fa-bullseye"></i>
      </q-btn>
      <q-btn flat>
          <i class="fa fa-shopping-cart"></i>
      </q-btn>
      <q-btn flat>
          <i class="fa fa-user"></i>
      </q-btn>
      <!--
      <q-btn 
        <q-tooltip v-if="$ctrl.CurrentGroup.map.options.showStores">
          <span translate="GROUPMAP.HIDE_STORES"></span>
        </q-tooltip>
        <q-tooltip v-if="!$ctrl.CurrentGroup.map.options.showStores">
          <span translate="GROUPMAP.SHOW_STORES"></span>
        </q-tooltip>
        <span class="fa-stack" v-if="!$ctrl.CurrentGroup.map.options.showStores">
          <i class="fa fa-shopping-cart fa-stack-1x"></i>
          <i class="fa fa-times fa-bot-right fa-stack-1x"></i>
        </span>
        <span class="fa-stack" v-if="$ctrl.CurrentGroup.map.options.showStores">
          <i class="fa fa-shopping-cart fa-stack-1x"></i>
          <i class="fa fa-check fa-bot-right fa-stack-1x"></i>
        </span>
      </q-btn>
      <q-btn 
        ng-click="$ctrl.CurrentGroup.map.options.showUsers = !$ctrl.CurrentGroup.map.options.showUsers;">
        <q-tooltip v-if="$ctrl.CurrentGroup.map.options.showUsers">
          <span translate="GROUPMAP.HIDE_USERS"></span>
        </q-tooltip>
        <q-tooltip v-if="!$ctrl.CurrentGroup.map.options.showUsers">
          <span translate="GROUPMAP.SHOW_USERS"></span>
        </q-tooltip>
        <span class="fa-stack" v-if="!$ctrl.CurrentGroup.map.options.showUsers">
          <i class="fa fa-user fa-stack-1x"></i>
          <i class="fa fa-times fa-bot-right fa-stack-1x"></i>
        </span>
        <span class="fa-stack" v-if="$ctrl.CurrentGroup.map.options.showUsers">
          <i class="fa fa-user fa-stack-1x"></i>
          <i class="fa fa-check fa-bot-right fa-stack-1x"></i>
        </span>
      </q-btn>
      -->
    </div>
    <div>This would be where leaflet goes...</div>
  </SidenavBox>
</template>

<script>
import { QBtn } from 'quasar'
import SidenavBox from './SidenavBox.vue'

export default {
  components: {
    SidenavBox, QBtn
  }
}
</script>

<style scoped lang="stylus">
</style>