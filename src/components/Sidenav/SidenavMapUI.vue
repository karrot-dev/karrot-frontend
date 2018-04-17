<template>
  <SidenavBox
    @toggle="$emit('toggleBox')"
    :expanded="expanded"
  >
    <template slot="icon">
      <q-icon name="fas fa-fw fa-map" />
    </template>
    <div
      slot="tools"
      class="tools"
    >
      <q-btn
        flat
        small
        @click="$router.push({name: 'map', params: {groupId: currentGroup.id}})"
      >
        <i class="fas fa-expand-arrows-alt fa-stack-1x" />
        <q-tooltip>
          {{ $t('GROUPMAP.FULL_SCREEN') }}
        </q-tooltip>
      </q-btn>
      <q-btn
        flat
        small
        @click="$emit('toggleStores')"
      >
        <span class="fa-fw fa-stack">
          <i class="fas fa-shopping-cart fa-stack-1x" />
          <i
            v-if="showStores"
            class="fas fa-check fa-bot-right fa-stack-1x"
          />
          <i
            v-else
            class="fas fa-times fa-bot-right fa-stack-1x"
          />
        </span>
        <q-tooltip>
          {{ $t( showStores ? 'GROUPMAP.HIDE_STORES' : 'GROUPMAP.SHOW_STORES') }}
        </q-tooltip>
      </q-btn>

      <q-btn
        flat
        small
        @click="$emit('toggleUsers')"
      >
        <span class="fa-fw fa-stack">
          <i class="fas fa-user fa-stack-1x" />
          <i
            v-if="showUsers"
            class="fas fa-check fa-bot-right fa-stack-1x"
          />
          <i
            v-else
            class="fas fa-times fa-bot-right fa-stack-1x"
          />
        </span>
        <q-tooltip>
          {{ $t( showUsers ? 'GROUPMAP.HIDE_USERS' : 'GROUPMAP.SHOW_USERS') }}
        </q-tooltip>
      </q-btn>
    </div>

    <GroupMap
      v-if="currentGroup"
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
import { QBtn, QTooltip, QIcon } from 'quasar'
import SidenavBox from './SidenavBox'
import GroupMap from '@/components/Map/GroupMap'

export default {
  components: { SidenavBox, QBtn, QTooltip, GroupMap, QIcon },
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
      default: null,
      type: Object,
    },
    expanded: {
      default: true,
      type: Boolean,
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
  .q-btn
    width 30px
    padding 0 1px
.map
  height: 260px
</style>
