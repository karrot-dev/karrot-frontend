<template>
  <QItem
    v-if="place && place.id && place.group"
    class="rounded-borders"
    tag="a"
    :to="{ name: 'place', params: { groupId: place.group, placeId: place.id } }"
  >
    <QItemSection avatar>
      <PlaceIcon :place="place" />
    </QItemSection>
    <QItemSection>
      <QItemLabel>{{ place.name }}</QItemLabel>
      <QItemLabel
        caption
        lines="1"
      >
        {{ place.address }}
      </QItemLabel>
    </QItemSection>
  </QItem>
</template>

<script setup>
import { QItem, QItemSection, QItemLabel } from 'quasar'

import PlaceIcon from '@/places/components/PlaceIcon.vue'

defineProps({
  place: {
    type: Object,
    default: () => null,
  },
})
</script>
