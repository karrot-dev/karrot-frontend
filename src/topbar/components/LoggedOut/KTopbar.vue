<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<<<<<<< HEAD


=======
<template>
  <KTopbarUI
    :breadcrumbs="$store.getters['breadcrumbs/all']"
    :current-user-id="$store.getters['auth/userId']"
    @logout="$store.dispatch('auth/logout')"
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
}
</script>
