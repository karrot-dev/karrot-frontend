<template>
  <QCard>
    <PlaceList
      class="white-background"
      :places="places"
      :archived="archivedPlaces"
    />
  </QCard>
</template>

<script setup>
import { QCard } from 'quasar'

import { useCurrentGroupService } from '@/group/services'

import PlaceList from '@/places/components/PlaceList'

const {
  places,
  archivedPlaces,
} = useCurrentGroupService()
</script>
