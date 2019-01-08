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

import { QCard } from 'quasar'
import KBanner from '@/alerts/components/KBanner'

export default {
  components: {
    QCard,
    KBanner,
  },
  computed: {
    ...mapGetters({
      store: 'stores/currentStore',
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
