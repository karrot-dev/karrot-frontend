<template>
  <SidenavPlacesUI
    :group-id="groupId"
    :places="filteredPlaces"
    :show-all-places="showAllPlaces"
    :archived="archivedPlaces"
    :is-editor="isEditor"
    :pending="isLoadingPlaces"
    @toggle-show-all-places="showAllPlaces = !showAllPlaces"
  />
</template>

<script setup>
import { ref, computed } from 'vue'

import SidenavPlacesUI from './SidenavPlacesUI'
import { useCurrentGroupService } from '@/group/services'
import { sortByName } from '@/places/datastore/places'
import { usePlaceHelpers } from '@/places/helpers'

const {
  groupId,
  isEditor,
  places,
  isLoadingPlaces,
} = useCurrentGroupService()

const {
  sortByPlaceStatus,
} = usePlaceHelpers()

const showAllPlaces = ref(false)

const archivedPlaces = computed(() => places.value.filter(place => place.status === 'archived'))

const filteredPlaces = computed(() => places.value
  // Never show these
  .filter(place => place.status !== 'archived')
  // Always show subscribed and active, show rest only with showAllPlaces enabled
  .filter(place => showAllPlaces.value || place.status === 'active' || place.isSubscribed)
  .sort(sortByName)
  .sort(sortByPlaceStatus))
</script>
