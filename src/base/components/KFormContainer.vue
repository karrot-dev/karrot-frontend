<template>
  <Component
    :is="$q.platform.is.mobile ? 'div' : 'QCard'"
    class="bg-white q-mb-lg no-shadow grey-border"
    v-bind="$attrs"
  >
    <slot />
  </Component>
</template>

<script>
import { QCard } from 'quasar'

export default {
  components: {
    QCard,
  },
}
</script>
