<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->
=======
<template>
  <Component
    :is="$q.platform.is.mobile ? 'div' : 'QCard'"
    class="bg-white q-mb-lg no-shadow grey-border"
    v-bind="$attrs"
  >
    <slot />
  </Component>
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import { QCard } from 'quasar'

export default {
  components: {
    QCard,
  },
}
</script>
