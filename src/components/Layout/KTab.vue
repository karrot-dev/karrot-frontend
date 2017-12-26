<template>
  <q-route-tab
    class="ktab"
    :to="to"
    slot="title"
    name="messages"
  >
    <slot name="icon"/>
    <div class="label">
      <slot/>
    </div>
  </q-route-tab>
</template>

<script>
import { QRouteTab, QChip } from 'quasar'

export default {
  components: { QRouteTab, QChip },
  props: {
    to: {
      type: Object,,
      required: false,
      default: '',
    },
  },
}
</script>

<style scoped lang="stylus">
  .label
    font-size .8em
    padding-top 1em
</style>
