<template>
  <span>
  <SidenavBox>
    <div slot="name"><i class="fa fa-fw fa-map"></i>{{$t("GROUPMAP.TITLE")}}</div>
    <div slot="tools" class="tools">
      <q-btn flat small>
        <i class="fa fa-bullseye"></i>
        <q-tooltip>
          <span>{{$t("GROUP.STORES")}}</span>
        </q-tooltip>
      </q-btn>
      <q-btn flat small @click="$emit('toggleStores')">
        <span class="fa-stack" v-if="!showStores">
          <i class="fa fa-shopping-cart fa-stack-1x"></i>
          <i class="fa fa-times fa-bot-right fa-stack-1x"></i>
        </span>
        <span class="fa-stack" v-if="showStores">
          <i class="fa fa-shopping-cart fa-stack-1x"></i>
          <i class="fa fa-check fa-bot-right fa-stack-1x"></i>
        </span>
        <q-tooltip v-if="!showStores">
          <span>{{$t("GROUPMAP.SHOW_STORES")}}</span>
        </q-tooltip>
        <q-tooltip v-if="showStores">
          <span>{{$t("GROUPMAP.HIDE_STORES")}}</span>
        </q-tooltip>
      </q-btn>

      <q-btn flat small @click="$emit('toggleUsers')">
        <span class="fa-stack" v-if="!showUsers">
          <i class="fa fa-user fa-stack-1x"></i>
          <i class="fa fa-times fa-bot-right fa-stack-1x"></i>
        </span>
        <span class="fa-stack" v-if="showUsers">
          <i class="fa fa-user fa-stack-1x"></i>
          <i class="fa fa-check fa-bot-right fa-stack-1x"></i>
        </span>
        <q-tooltip v-if="!showUsers">
          <span>{{$t("GROUPMAP.SHOW_USERS")}}</span>
        </q-tooltip>
        <q-tooltip v-if="showUsers">
          <span>{{$t("GROUPMAP.HIDE_USERS")}}</span>
        </q-tooltip>
      </q-btn>
    </div>
    <div>
      <GroupMap class="map" :stores="stores" :users="users" :showUsers="showUsers" :showStores="showStores" :selectedStoreId="selectedStoreId"/>
    </div>
  </SidenavBox>
  </span>
</template>

<script>
import { QBtn, QTooltip } from 'quasar'
import SidenavBox from './SidenavBox.vue'
import GroupMap from '@/components/Map/GroupMap.vue'

export default {
  components: {
    SidenavBox, QBtn, QTooltip, GroupMap,
  },
  props: {
    stores: { required: false },
    users: { required: false },
    showStores: { default: true },
    showUsers: { default: true },
    selectedStoreId: { required: false },
  },
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
