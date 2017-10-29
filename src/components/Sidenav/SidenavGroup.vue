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
        <q-item :to="{name: 'groupDescription'}">{{ $t("GROUP.DESCRIPTION") }}</q-item>
        <q-item :to="{name: 'groupMembers'}">{{ $t("GROUP.MEMBERS") }}</q-item>
        <q-item :to="{name: 'groupHistory'}">{{ $t("GROUP.HISTORY") }}</q-item>
      </q-list>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem } from 'quasar'
import SidenavBox from './SidenavBox'
import GroupOptions from './GroupOptions'

export default {
  components: {
    SidenavBox, GroupOptions, QBtn, QList, QItem,
  },
}
</script>

<style scoped lang="stylus">
</style>
