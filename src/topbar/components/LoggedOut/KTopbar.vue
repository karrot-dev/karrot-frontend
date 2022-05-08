<template>
  <KTopbarUI
    :breadcrumbs="$store.getters['breadcrumbs/all']"
    :current-user-id="$store.getters['auth/userId']"
    @logout="$store.dispatch('auth/logout')"
  >
    <slot />
  </KTopbarUI>
</template>

<script>
import KTopbarUI from './KTopbarUI'

export default {
  components: {
    KTopbarUI,
  },
}
</script>
