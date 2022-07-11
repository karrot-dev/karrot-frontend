<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

=======
<template>
  <KTopbarUI
    :current-group="$store.getters['currentGroup/value']"
    :my-groups="$store.getters['groups/mine']"
    :breadcrumbs="$store.getters['breadcrumbs/all']"
    :user="$store.getters['auth/user']"
    :search-open="$store.getters['search/open']"
    :away="$store.getters['presence/toggle/away']"
    :connected="$store.getters['connectivity/connected']"
    :reconnecting="$store.getters['connectivity/reconnecting']"
    @logout="$store.dispatch('auth/logout')"
    @reconnect="$store.dispatch('connectivity/reconnect')"
    @show-search="$store.commit('search/show')"
    @hide-search="$store.commit('search/hide')"
    @toggle-sidenav="$emit('toggle-sidenav')"
  >
    <slot />
  </KTopbarUI>
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import KTopbarUI from './KTopbarUI'

export default {
  components: {
    KTopbarUI,
  },
  emits: [
    'toggle-sidenav',
  ],
}
</script>
