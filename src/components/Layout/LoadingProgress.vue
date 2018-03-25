<template>
  <q-progress
    v-if="loading || closing"
    indeterminate
    animate
    color="warning"
    class="fixed-top"
    style="height: 2px; z-index: 2500"
  />
</template>

<script>
import { QProgress } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: { QProgress },
  computed: {
    ...mapGetters({
      loading: 'loadingprogress/active',
      closing: 'loadingprogress/closing',
    }),
  },
}
</script>
