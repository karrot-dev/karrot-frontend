<template>
  <img
    :src="logo"
    :class="{ loading: isLoading }"
  >
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  props: {
    showLoading: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    isLoading () {
      return this.showLoading && (this.loading || this.closing)
    },
    logo () {
      return __ENV.KARROT_THEME === 'dev' ? require('@/logo/assets/carrot-logo.dev.svg') : require('@/logo/assets/carrot-logo.svg')
    },
    ...mapGetters({
      loading: 'loadingprogress/active',
      closing: 'loadingprogress/closing',
    }),
  },
}
</script>

<style scoped lang="stylus">
@keyframes myanim
  0%, 100%
    opacity .5
    transform scale(.9)
  50%
    opacity 1
    transform scale(1)

img
  height 90%
.loading
  animation myanim 1s cubic-bezier(.4, 0, .5, 1) infinite
</style>
