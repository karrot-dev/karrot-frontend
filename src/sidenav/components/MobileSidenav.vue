<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->



<<<<<<< HEAD

=======
<template>
  <MobileSidenavUI
    :current-user-id="$store.getters['auth/userId']"
    @logout="data => $store.dispatch('auth/logout', data)"
    @toggle-sidenav="$emit('toggle-sidenav')"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import MobileSidenavUI from './MobileSidenavUI'

export default {
  components: {
    MobileSidenavUI,
  },
  emits: [
    'toggle-sidenav',
  ],
}
</script>
