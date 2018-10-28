<template>
  <div>
    <img
      :src="logo"
      :class="{ loading: loading || closing }"
    >
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  computed: {
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

img, div
  height 95%
.loading
  animation myanim 1s cubic-bezier(.4, 0, .5, 1) infinite
</style>
