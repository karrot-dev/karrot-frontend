<template>
  <SidenavMapUI
    :places="$store.getters['places/byCurrentGroup']"
    :users="users"
    :show-places="$store.getters['sidenavBoxes/toggle/placesOnMap']"
    :show-users="$store.getters['sidenavBoxes/toggle/usersOnMap']"
    :selected-place="$store.getters['places/activePlace']"
    :selected-user="$store.getters['users/activeUser']"
    :current-group="$store.getters['currentGroup/value']"
    :is-editor="$store.getters['currentGroup/isEditor']"
    @toggle-places="$store.dispatch('sidenavBoxes/toggle/placesOnMap')"
    @toggle-users="$store.dispatch('sidenavBoxes/toggle/usersOnMap')"
  />
</template>

<script setup>
import SidenavMapUI from './SidenavMapUI'
import { useCurrentGroupService } from '@/group/services'

const { users } = useCurrentGroupService()
</script>
