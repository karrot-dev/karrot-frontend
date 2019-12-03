<template>
  <div v-if="place && place.status === 'archived'">
    <QCard>
      <QBanner
        inline-actions
        class="bg-info"
      >
        {{ $t('STOREDETAIL.ARCHIVED') }}
        <template #avatar>
          <QIcon
            name="fas fa-trash-alt"
            size="1.4em"
          />
        </template>
        <template #action>
          <QBtn
            v-if="isEditor"
            flat
            dense
            :label="$t('STOREEDIT.RESTORE')"
            @click="restore"
          />
        </template>
      </QBanner>
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

import {
  QCard,
  QBanner,
  QIcon,
  QBtn,
} from 'quasar'
import PlaceTabs from '@/places/components/PlaceTabs'
import PlaceHeader from '@/places/components/PlaceHeader'

export default {
  components: {
    QCard,
    QBanner,
    QIcon,
    QBtn,
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
