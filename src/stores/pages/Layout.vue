<template>
  <div v-if="store && store.status === 'archived'">
    <QCard>
      <KBanner
        color="info"
        icon="fas fa-trash-alt"
        :actions="isEditor ? [{ label: $t('STOREEDIT.RESTORE'), handler: restore }] : []"
      >
        {{ $t('STOREDETAIL.ARCHIVED') }}
      </KBanner>
    </QCard>
  </div>
  <RouterView v-else/>
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
      this.$store.dispatch('stores/save', { id: this.store.id, status: 'created' })
    },
  },
}
</script>
