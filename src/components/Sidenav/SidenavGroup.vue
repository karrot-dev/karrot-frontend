<template>
  <SidenavBox>
    <div slot="name">
      <i class="fa fa-fw fa-home" />
      {{ $t('GROUP.GROUP') }}
    </div>

    <div slot="tools">
      <q-btn flat>
        <i
          class="fa fa-ellipsis-v"
          aria-hidden="true"
        />
        <q-tooltip v-t="'BUTTON.MORE_OPTIONS'" />
        <GroupOptions/>
      </q-btn>
    </div>

    <div>
      <q-list
        highlight
        no-border
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
}
</script>

<style scoped lang="stylus">
</style>
