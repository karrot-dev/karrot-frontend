<template>
  <SidenavPlacesUI
    :group-id="groupId"
    :places="places"
    :is-editor="isEditor"
    :pending="isLoadingPlaces"
  />
</template>

<script setup>
import { useCurrentGroupService } from '@/group/services'

import SidenavPlacesUI from './SidenavPlacesUI'

const {
  groupId,
  isEditor,
  places,
  isLoadingPlaces,
} = useCurrentGroupService()
</script>
