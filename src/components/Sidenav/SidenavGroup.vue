<template>
  <SidenavBox>
    <div slot="name"><i class="fa fa-fw fa-home" />{{ $t('GROUP.GROUP') }}</div>
    <div slot="tools">
      <q-btn flat>
        <i class="fa fa-ellipsis-v" aria-hidden="true" />
        <q-tooltip v-t="'BUTTON.MORE_OPTIONS'" />
        <GroupOptions/>
      </q-btn>
    </div>
    <div>
      <q-list highlight no-border>
        <q-item :to="{name: 'groupDescription'}">{{ $t('GROUP.DESCRIPTION') }}</q-item>
        <q-item :to="{name: 'groupMembers'}">{{ $t('GROUP.MEMBERS') }}</q-item>
        <q-item :to="{name: 'groupHistory'}">{{ $t('GROUP.HISTORY') }}</q-item>
      </q-list>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QTooltip } from 'quasar'
import SidenavBox from './SidenavBox'
import GroupOptions from './GroupOptions'

export default {
  components: {
    SidenavBox, GroupOptions, QBtn, QList, QItem, QTooltip,
  },
}
</script>

<style scoped lang="stylus">
</style>
