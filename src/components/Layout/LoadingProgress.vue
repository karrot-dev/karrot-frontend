<template>
  <q-progress
    v-if="active || closing"
    :indeterminate="!closing"
    :percentage="closing ? 100 : 0"
    animate
    color="warning"
    class="fixed-top z-alert"
  />
</template>

<script>
import { QProgress } from 'quasar'

export default {
  components: { QProgress },
  computed: {
    active () { return this.$store.getters['loadingprogress/active'] },
    closing () { return this.$store.getters['loadingprogress/closing'] },
  },
}
</script>

<style scoped lang="stylus">
</style>
