<template>
  <QCard>
    <PlaceList
      class="white-background"
      :group-id="groupId"
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
  groupId,
  places,
  archivedPlaces,
} = useCurrentGroupService()
</script>
