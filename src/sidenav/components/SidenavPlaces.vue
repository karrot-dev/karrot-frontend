<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<<<<<<< HEAD


=======
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
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import SidenavPlacesUI from './SidenavPlacesUI'

export default {
  components: {
    SidenavPlacesUI,
  },
}
</script>
