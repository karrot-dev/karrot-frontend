<template>
  <SidenavBox>
    <div slot="name">Map</div>
    <div slot="tools" class="tools">
      <q-btn flat>
          <i class="fa fa-bullseye"></i>
      </q-btn>
      <q-btn flat @click="showStores = !showStores">
        <!--<q-tooltip v-if="!showStores">
          <span translate="GROUPMAP.HIDE_STORES"></span>
        </q-tooltip>
        <q-tooltip v-if="showStores">
          <span translate="GROUPMAP.SHOW_STORES"></span>
        </q-tooltip>-->
        <span class="fa-stack" v-if="!showStores">
          <i class="fa fa-shopping-cart fa-stack-1x"></i>
          <i class="fa fa-times fa-bot-right fa-stack-1x"></i>
        </span>
        <span class="fa-stack" v-if="showStores">
          <i class="fa fa-shopping-cart fa-stack-1x"></i>
          <i class="fa fa-check fa-bot-right fa-stack-1x"></i>
        </span>
      </q-btn>

      <q-btn flat @click="showUsers = !showUsers">
        <!--<q-tooltip v-if="$ctrl.CurrentGroup.map.options.showUsers">
          <span translate="GROUPMAP.HIDE_USERS"></span>
        </q-tooltip>
        <q-tooltip v-if="!$ctrl.CurrentGroup.map.options.showUsers">
          <span translate="GROUPMAP.SHOW_USERS"></span>
        </q-tooltip>-->
        <span class="fa-stack" v-if="!showUsers">
          <i class="fa fa-user fa-stack-1x"></i>
          <i class="fa fa-times fa-bot-right fa-stack-1x"></i>
        </span>
        <span class="fa-stack" v-if="showUsers">
          <i class="fa fa-user fa-stack-1x"></i>
          <i class="fa fa-check fa-bot-right fa-stack-1x"></i>
        </span>
      </q-btn>
      <!--
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
    <div>
      <GroupMap class="map" :users="users" :stores="stores"
        :showUsers="showUsers" :showStores="showStores"/>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn } from 'quasar'
import SidenavBox from './SidenavBox.vue'
import GroupMap from '../Map/GroupMap.vue'

export default {
  components: {
    SidenavBox, QBtn, GroupMap
  },
  props: {
    stores: { required: false },
    users: { required: false }
  },
  data () {
    return {
      showUsers: true,
      showStores: true
    }
  }
}
</script>

<style scoped lang="stylus">
@import '~variables'

.tools
  .fa.fa-bot-right
    left 5px
    top 5px
  .fa.fa-check
    color $positive
  .fa.fa-times
    color $negative
.map
  height: 260px
</style>