<template>
  <SidenavBox>
    <div slot="name"><i class="fa fa-fw fa-map" />{{ $t('GROUPMAP.TITLE') }}</div>
    <div slot="tools" class="tools">
      <q-btn flat small @click="$emit('toggleStores')">
        <span class="fa-stack">
          <i class="fa fa-shopping-cart fa-stack-1x" />
          <i v-if="showStores" class="fa fa-check fa-bot-right fa-stack-1x" />
          <i v-else class="fa fa-times fa-bot-right fa-stack-1x" />
        </span>
        <q-tooltip>
          {{ $t( showStores ? 'GROUPMAP.HIDE_STORES' : 'GROUPMAP.SHOW_STORES') }}
        </q-tooltip>
      </q-btn>

      <q-btn flat small @click="$emit('toggleUsers')">
        <span class="fa-stack">
          <i class="fa fa-user fa-stack-1x" />
          <i v-if="showUsers" class="fa fa-check fa-bot-right fa-stack-1x" />
          <i v-else class="fa fa-times fa-bot-right fa-stack-1x" />
        </span>
        <q-tooltip>
          {{ $t( showUsers ? 'GROUPMAP.HIDE_USERS' : 'GROUPMAP.SHOW_USERS') }}
        </q-tooltip>
      </q-btn>
    </div>
    <GroupMap
      class="map"
      :stores="stores"
      :users="users"
      :show-users="showUsers"
      :show-stores="showStores"
      :selected-store-id="selectedStoreId"
      :current-group="currentGroup"
    />
  </SidenavBox>
</template>

<script>
import { QBtn, QTooltip } from 'quasar'
import SidenavBox from './SidenavBox'
import GroupMap from '@/components/Map/GroupMap'

export default {
  components: {
    SidenavBox, QBtn, QTooltip, GroupMap,
  },
  props: {
    stores: {
      default: () => [],
      type: Array,
    },
    users: {
      default: () => [],
      type: Array,
    },
    selectedStoreId: {
      default: null,
      type: Number,
    },
    showStores: {
      default: true,
      type: Boolean,
    },
    showUsers: {
      default: true,
      type: Boolean,
    },
    currentGroup: {
      required: true,
      type: Object,
    },
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
