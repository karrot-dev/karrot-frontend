<template>
  <SidenavBox>
    <div slot="name"><i class="fa fa-fw fa-home"></i>Options</div>
    <div slot="tools">
      <q-btn flat>
        <i class="fa fa-ellipsis-v" aria-hidden="true"></i>
        <q-popover fit ref="popover">
          <GroupOptions/>
        </q-popover>
      </q-btn>
    </div>
    <div>
      <q-list highlight no-border>
        <q-item :to="{name: 'storePickups'}">{{ $t("GROUP.PICKUPS")}}</q-item>
        <q-item :to="{name: 'storeHistory'}">{{ $t("GROUP.HISTORY")}}</q-item>
      </q-list>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QPopover } from 'quasar'
import SidenavBox from './SidenavBox.vue'
import GroupOptions from './GroupOptions.vue'

export default {
  components: {
    SidenavBox, GroupOptions, QBtn, QList, QItem, QPopover,
  },
}
</script>

<style scoped lang="stylus">
</style>