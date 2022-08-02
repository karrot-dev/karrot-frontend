<template>
  <SidenavPlacesUI
    :group-id="groupId"
    :places="enrichedAndFilteredPlaces"
    :show-all-places="showAllPlaces"
    :archived="enrichedArchivedPlaces"
    :is-editor="isEditor"
    :pending="isLoadingPlaces"
    @toggle-show-all-places="showAllPlaces = !showAllPlaces"
  />
</template>

<script setup>
import { ref, computed } from 'vue'

import SidenavPlacesUI from './SidenavPlacesUI'
import { usePlaceEnricher } from '@/places/enrichers'
import { useCurrentGroupService } from '@/group/services'
import { sortByName, sortByStatus } from '@/places/datastore/places'

const {
  groupId,
  isEditor,
  places,
  isLoadingPlaces,
} = useCurrentGroupService()

const enrichPlace = usePlaceEnricher()

const showAllPlaces = ref(false)

const enrichedArchivedPlaces = computed(() => places.value.filter(place => place.status === 'archived').map(enrichPlace))

const enrichedAndFilteredPlaces = computed(() => places.value
  // Never show these
  .filter(place => place.status !== 'archived')
  // Always show subscribed and active, show rest only with showAllPlaces enabled
  .filter(place => showAllPlaces.value || place.status === 'active' || place.isSubscribed)
  .map(enrichPlace)
  .sort(sortByName)
  .sort(sortByStatus))
</script>
