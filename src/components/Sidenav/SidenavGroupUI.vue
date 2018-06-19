<template>
  <SidenavBox
    @toggle="$emit('toggleBox')"
    :expanded="expanded"
  >
    <template slot="icon">
      <q-icon name="fas fa-fw fa-home" />
    </template>
    <div
      slot="tools"
      class="tools"
    >
      <q-btn
        flat
        dense
        round
        :to="{name: 'groupSettings'}"
      >
        <q-icon name="fas fa-cog fa-fw" />
        <q-tooltip v-t="'GROUP.SETTINGS'" />
      </q-btn>
      <q-btn
        flat
        dense
        round
      >
        <q-icon name="fas fa-fw fa-ellipsis-v" />
        <GroupOptions/>
      </q-btn>
    </div>

    <div>
      <q-list
        highlight
        no-border
        class="no-padding"
      >
        <q-item :to="{name: 'group'}">
          <q-item-side class="text-center">
            <q-icon name="fas fa-bullhorn" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.WALL") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'groupPickups'}">
          <q-item-side class="text-center">
            <q-icon name="fas fa-shopping-basket" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.PICKUPS") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'groupFeedback'}">
          <q-item-side class="text-center">
            <q-icon name="fas fa-balance-scale" />
          </q-item-side>
          <q-item-main>
            {{ $t("PICKUP_FEEDBACK.TITLE") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'groupDescription'}">
          <q-item-side class="text-center">
            <i class="far fa-address-card"/>
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.DESCRIPTION") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'groupMembers'}">
          <q-item-side class="text-center">
            <q-icon name="fas fa-users" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.MEMBERS") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'groupHistory'}">
          <q-item-side class="text-center">
            <i class="far fa-clock"/>
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.HISTORY") }}
          </q-item-main>
        </q-item>
      </q-list>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QItemSide, QItemMain, QIcon, QTooltip } from 'quasar'
import SidenavBox from './SidenavBox'
import GroupOptions from './GroupOptions'

export default {
  components: {
    SidenavBox, GroupOptions, QBtn, QList, QItem, QItemSide, QItemMain, QIcon, QTooltip,
  },
  props: {
    expanded: { default: true, type: Boolean },
  },
}
</script>

<style scoped lang="stylus">
</style>
