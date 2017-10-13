<template>
  <SidenavBox>
    <div slot="name"><i class="fa fa-fw fa-home"></i>Store Options</div>
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
        <q-item :to="{name: 'storePickups', params: { storeId }}">{{ $t("GROUP.PICKUPS")}}</q-item>
        <q-item :to="{name: 'storeHistory', params: { storeId }}">{{ $t("GROUP.HISTORY")}}</q-item>
        <q-item :to="{name: 'storeEdit', params: { storeId }}">{{ $t("STORE.EDIT")}}</q-item>
      </q-list>
    </div>
  </SidenavBox>
</template>

<script>
import { QBtn, QList, QItem, QPopover } from 'quasar'
import SidenavBox from './SidenavBox.vue'
import GroupOptions from './GroupOptions.vue'

export default {
  props: {
    storeId: { required: true },
  },
  components: {
    SidenavBox, GroupOptions, QBtn, QList, QItem, QPopover,
  },
}
</script>

<style scoped lang="stylus">
</style>
