<template>
  <div v-if="place && place.status === 'archived'">
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
      place: 'places/activePlace',
      isEditor: 'currentGroup/isEditor',
    }),
  },
  methods: {
    restore () {
      this.$store.dispatch('places/save', { id: this.place.id, status: 'created' })
    },
  },
}
</script>
