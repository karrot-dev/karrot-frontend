<template>
  <SidenavMapUI
    :places="places"
    :users="users"
    :show-places="$store.getters['sidenavBoxes/toggle/placesOnMap']"
    :show-users="$store.getters['sidenavBoxes/toggle/usersOnMap']"
    :selected-place="activePlace"
    :selected-user="activeUser"
    :current-group="currentGroup"
    :is-editor="isEditor"
    @toggle-places="$store.dispatch('sidenavBoxes/toggle/placesOnMap')"
    @toggle-users="$store.dispatch('sidenavBoxes/toggle/usersOnMap')"
  />
</template>

<script setup>
import SidenavMapUI from './SidenavMapUI'
import { useCurrentGroupService } from '@/group/services'
import { useActivePlaceService } from '@/places/services'
import { useActiveUserService } from '@/users/services'

const {
  isEditor,
  users,
  places,
  group: currentGroup,
} = useCurrentGroupService()

const {
  place: activePlace,
} = useActivePlaceService()

const {
  user: activeUser,
} = useActiveUserService()
</script>
