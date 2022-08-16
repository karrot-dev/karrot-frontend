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

import PlaceList from '@/places/components/PlaceList'
import { useCurrentGroupService } from '@/group/services'

const {
  groupId,
  places,
  archivedPlaces,
} = useCurrentGroupService()
</script>
