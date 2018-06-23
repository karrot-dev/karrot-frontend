<template>
  <q-route-tab
    class="ktab"
    :to="to"
    slot="title"
    name="messages"
    exact
  >
    <slot name="icon"/>
    <div class="label">
      <slot/>
    </div>
  </q-route-tab>
</template>

<script>
import { QRouteTab } from 'quasar'

export default {
  components: { QRouteTab },
  props: {
    to: {
      default: '',
      type: Object | String,
    },
  },
}
</script>

<style scoped lang="stylus">
  .label
    font-size .8em
    padding-top 1em
    opacity 0.7
  .ktab
    transition:  color  .3s ease-out
  .active
    opacity .7
</style>
