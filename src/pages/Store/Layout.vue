<template>
  <div>
    <div v-if="$q.platform.is.mobile" slot="navigation" class="shadow-14 inset-shadow row">
      <q-tabs align="center" color="tertiary" hide="icon" class="col" >
        <q-route-tab
            :to="{name: 'storePickups'}"
            exact
            slot="title"
            name="pickups"
        >{{ $t('GROUP.PICKUPS' )}}</q-route-tab>
        <q-route-tab
            :to="{name: 'storeHistory'}"
            exact
            slot="title"
            name="history"
        >{{ $t('GROUP.HISTORY' )}}</q-route-tab>
      </q-tabs>
      <q-btn flat class="bg-tertiary text-white">
        <q-icon name="fa-ellipsis-v" />
        <StoreOptions/>
      </q-btn>
    </div>
    <router-view></router-view>
  </div>
</template>

<script>

import { mapGetters } from 'vuex'
import Markdown from '@/components/Markdown'
import StoreOptions from '@/components/Sidenav/StoreOptions'

import { QCard, QTabs, QRouteTab, QScrollArea, QBtn, QIcon } from 'quasar'

export default {
  components: { QCard, QTabs, QRouteTab, QScrollArea, QBtn, QIcon, StoreOptions, Markdown },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
    }),
  },
}
</script>

<style scoped lang="stylus">
.overflow
  overflow-y auto
  max-height 120px
</style>
