<template>
  <q-route-tab :to="to" slot="title" name="messages">
    <slot name="icon"></slot>
    <div class="label">
      <slot></slot>
    </div>
  </q-route-tab>
</template>

<script>
import { QRouteTab, QChip } from 'quasar'

export default {
  components: { QRouteTab, QChip },
  props: {
    to: { required: false, default: '' },
  },
}
</script>

<style scoped lang="stylus">
  .label
    font-size .8em
</style>