<template>
  <SidenavBox
    @toggleBoxCollapsed="$emit('toggleBoxCollapsed')"
    :collapsible="collapsible"
    :collapsed="collapsed">
    <template slot="icon">
      <q-icon name="fa-fw fa-home" />
    </template>
    <template slot="tools">
      <q-btn
        flat
        small
      >
        <q-icon name="fa-fw fa-ellipsis-v" />
        <q-tooltip v-t="'BUTTON.MORE_OPTIONS'" />
        <GroupOptions/>
      </q-btn>
    </template>

    <div>
      <q-list
        highlight
        no-border
        class="no-padding"
      >
        <q-item :to="{name: 'group'}">
          <q-item-side class="text-center">
            <q-icon name="fa-bullhorn" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.WALL") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'groupPickups'}">
          <q-item-side class="text-center">
            <q-icon name="fa-shopping-basket" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.PICKUPS") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'groupDescription'}">
          <q-item-side class="text-center">
            <q-icon name="fa-vcard" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.DESCRIPTION") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'groupMembers'}">
          <q-item-side class="text-center">
            <q-icon name="fa-users" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.MEMBERS") }}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'groupHistory'}">
          <q-item-side class="text-center">
            <q-icon name="fa-clock-o" />
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
    collapsible: { default: true },
    collapsed: { required: true },
  },
}
</script>

<style scoped lang="stylus">
</style>
