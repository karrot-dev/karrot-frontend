<template>
  <img
    :src="logo"
    :class="{ loading: isLoading }"
  >
</template>

<script>
import { mapGetters } from 'vuex'
import logo from '@/logo/assets/carrot-logo.svg'

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
    ...mapGetters({
      loading: 'loadingprogress/active',
      closing: 'loadingprogress/closing',
    }),
  },
  created () {
    this.logo = process.env.KARROT.THEME === 'dev' ? 'icons/dev.svg' : logo
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
