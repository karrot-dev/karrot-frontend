<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

=======
<template>
  <SidenavMapUI
    :places="$store.getters['places/byCurrentGroup']"
    :users="$store.getters['users/byCurrentGroup']"
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
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import SidenavMapUI from './SidenavMapUI'

export default {
  components: {
    SidenavMapUI,
  },
}
</script>
