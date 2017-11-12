<template>
  <div v-if="store.status != 'archived'">
      <q-tabs v-if="$q.platform.is.mobile" align="center" color="tertiary" class="shadow-14 inset-shadow" hide="icon" slot="navigation">
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
        <q-tooltip v-t="'BUTTON.MORE_OPTIONS'" />
        <StoreOptions/>
      </q-btn>
    </div>
    <router-view></router-view>
  </div>
  <div v-else>
    <q-card>
      <k-alert color="warning" icon="fa-trash" :actions="[{label: 'Undelete', handler: undelete}]">
        Store is not available anymore because it got deleted.
      </k-alert>
    </q-card>
  </div>
</template>

<script>

import { mapGetters, mapActions } from 'vuex'
import Markdown from '@/components/Markdown'
import StoreOptions from '@/components/Sidenav/StoreOptions'

import { QCard, QTabs, QRouteTab, QScrollArea, QBtn, QIcon, QTooltip } from 'quasar'
import KAlert from '@/components/Layout/KAlert'

export default {
  components: { QCard, QTabs, QRouteTab, QScrollArea, KAlert, QBtn, QIcon, QTooltip, StoreOptions, Markdown },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
    }),
  },
  methods: {
    ...mapActions({
      undelete: 'stores/undelete',
    }),
  },
}
</script>

<style scoped lang="stylus">
.overflow
  overflow-y auto
  max-height 120px
</style>
