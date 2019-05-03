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
  <div v-else>
    <PlaceHeader />
    <PlaceTabs v-if="place" />
    <RouterView />
  </div>
</template>

<script>

import { mapGetters } from 'vuex'

import { QCard } from 'quasar'
import KBanner from '@/alerts/components/KBanner'
import PlaceTabs from '@/places/components/PlaceTabs'
import PlaceHeader from '@/places/components/PlaceHeader'

export default {
  components: {
    QCard,
    KBanner,
    PlaceTabs,
    PlaceHeader,
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
