<template>
  <QLinearProgress
    v-if="loading || closing"
    indeterminate
    color="info"
    class="fixed-top"
    style="height: 2px; z-index: 2500"
  />
</template>

<script>
import { QLinearProgress } from 'quasar'
import { mapGetters } from 'vuex'

export default {
  components: { QLinearProgress },
  computed: {
    ...mapGetters({
      loading: 'loadingprogress/active',
      closing: 'loadingprogress/closing',
    }),
  },
}
</script>
