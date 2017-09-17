<template>
  <q-tab slot="title" name="messages">
    <slot name="icon"></slot>
    <div class="label">
      <slot></slot>
    </div>
  </q-tab>
</template>

<script>
import { QTab, QChip } from 'quasar'

export default {
  components: { QTab, QChip },
}
</script>

<style scoped lang="stylus">
  .label
    font-size .8em
</style>