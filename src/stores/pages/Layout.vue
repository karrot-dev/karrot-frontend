<template>
  <div v-if="store && store.status === 'archived'">
    <q-card>
      <k-banner
        color="info"
        icon="fas fa-trash-alt"
        :actions="isEditor ? [{ label: $t('STOREEDIT.RESTORE'), handler: restore }] : []"
      >
        {{ $t('STOREDETAIL.ARCHIVED') }}
      </k-banner>
    </q-card>
  </div>
  <router-view v-else/>
</template>

<script>

import { mapGetters } from 'vuex'
import Markdown from '@/utils/components/Markdown'
import StoreOptions from '@/sidenav/components/StoreOptions'

import { QCard, QTabs, QRouteTab, QScrollArea, QBtn, QIcon } from 'quasar'
import KBanner from '@/alerts/components/KBanner'

export default {
  components: { QCard, QTabs, QRouteTab, QScrollArea, KBanner, QBtn, QIcon, StoreOptions, Markdown },
  computed: {
    ...mapGetters({
      store: 'stores/activeStore',
      isEditor: 'currentGroup/isEditor',
    }),
  },
  methods: {
    restore () {
      this.$datastore.dispatch('stores/save', { id: this.store.id, status: 'created' })
    },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
.store-banner
  margin: 8px 8px -13px 8px
  > span
    display: block
    height 5vw
    min-height 30px
    max-height 48px
    overflow hidden

body.mobile .store-banner
  margin: 0px 0px -13px 0px
  border 0
  max-height: 30px
  overflow: hidden
</style>
