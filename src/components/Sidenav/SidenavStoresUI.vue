<template>
  <SidenavBox>
    <div slot="name"><i class="fa fa-fw fa-shopping-cart"></i>{{ $t("GROUP.STORES") }}</div>
    <div slot="tools">
      <router-link :to="{name: 'storeCreate'}">
        <q-btn class="text-white" small flat>
          <q-icon size="1em" name="fa-plus-circle" />
          {{ $t("BUTTON.CREATE") }}
        </q-btn>
      </router-link>
    </div>
    <div>
      <q-list highlight no-border>
        <q-item
          v-for="store in stores" :key="store.id"
          v-if="!store.statusObj.hidden"
          link :to="{name: 'store', params: { storeId: store.id }}">
          <q-item-side class="text-center">
            <q-icon :name="store.statusObj.icon" :color="store.statusObj.color">
              <q-tooltip>{{ $t(store.statusObj.label) }}</q-tooltip>
            </q-icon>
          </q-item-side>
          <q-item-main>
            {{ store.name }}
          </q-item-main>
        </q-item>
      </q-list>
    </div>
  </SidenavBox>
</template>

<script>

import { QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QTooltip } from 'quasar'
import SidenavBox from './SidenavBox.vue'

export default {
  props: {
    stores: { required: true },
  },
  components: {
    SidenavBox, QBtn, QList, QItem, QItemMain, QItemSide, QIcon, QTooltip,
  },
}
</script>

<style scoped lang="stylus">
  .fa
    margin-right: .3em
</style>
