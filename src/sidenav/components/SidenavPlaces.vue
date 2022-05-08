<template>
  <SidenavPlacesUI
    :group-id="$store.getters['currentGroup/id']"
    :places="$store.getters['places/byCurrentGroup']"
    :show-all-places="$store.getters['places/toggle/showAll']"
    :archived="$store.getters['places/byCurrentGroupArchived']"
    :is-editor="$store.getters['currentGroup/isEditor']"
    :fetch-status="$store.getters['places/fetchStatus']"
    @toggle-show-all-places="$store.dispatch('places/toggle/showAll')"
  />
</template>

<script>
import SidenavPlacesUI from './SidenavPlacesUI'

export default {
  components: {
    SidenavPlacesUI,
  },
}
</script>
