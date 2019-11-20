<template>
  <QLinearProgress
    v-if="loading || closing"
    indeterminate
    color="info"
    class="fixed-top"
    style=" z-index: 2500;height: 2px"
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
