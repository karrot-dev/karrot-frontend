<template>
  <SidenavBox>
    <div slot="name"><i class="fa fa-fw fa-home"></i>{{ $t("GROUP.GROUP") }}</div>
    <div slot="tools">
      <q-btn flat>
        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        <GroupOptions/>
      </q-btn>
    </div>
    <div>
      <q-list highlight no-border>
        <q-item :to="{name: 'groupDescription'}">
          <q-item-side class="text-center">
            <q-icon name="fa-vcard" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.DESCRIPTION")}}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'groupMembers'}">
          <q-item-side class="text-center">
            <q-icon name="fa-users" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.MEMBERS")}}
          </q-item-main>
        </q-item>
        <q-item :to="{name: 'groupHistory'}">
          <q-item-side class="text-center">
            <q-icon name="fa-clock-o" />
          </q-item-side>
          <q-item-main>
            {{ $t("GROUP.HISTORY")}}
          </q-item-main>
        </q-item>
      </q-list>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QItemSide, QItemMain, QIcon } from 'quasar'
import SidenavBox from './SidenavBox'
import GroupOptions from './GroupOptions'

export default {
  components: {
    SidenavBox, GroupOptions, QBtn, QList, QItem, QItemSide, QItemMain, QIcon,
  },
}
</script>

<style scoped lang="stylus">
</style>
