<template>
  <QBanner class="q-ma-lg q-pa-lg bg-secondary text-white">
    <template #avatar>
      <slot name="icon" />
    </template>
    <h5 class="q-ma-none">
      <slot />
    </h5>
    <slot name="desc" />
    <template #action>
      <slot name="action" />
    </template>
  </QBanner>
</template>

<script>
import { QBanner } from 'quasar'

export default {
  components: {
    QBanner,
  },
}
</script>
