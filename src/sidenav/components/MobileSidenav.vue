<template>
  <MobileSidenavUI
    :current-user-id="$store.getters['auth/userId']"
    @logout="data => $store.dispatch('auth/logout', data)"
    @toggle-sidenav="$emit('toggle-sidenav')"
  />
</template>

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
