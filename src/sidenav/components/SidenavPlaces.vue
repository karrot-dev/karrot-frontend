<template>
  <SidenavPlacesUI
    :group-id="groupId"
    :places="places"
    :show-all-places="showAllPlaces"
    :archived="archivedPlaces"
    :is-editor="isEditor"
    :pending="isLoadingPlaces"
    @toggle-show-all-places="showAllPlaces = !showAllPlaces"
  />
</template>

<script setup>
import SidenavPlacesUI from './SidenavPlacesUI'
import { useCurrentGroupService } from '@/group/services'

const {
  groupId,
  isEditor,
  places,
  showAllPlaces,
  archivedPlaces,
  isLoadingPlaces,
} = useCurrentGroupService()
</script>
