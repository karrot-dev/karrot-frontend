<template>
  <img
    :src="logo"
    :class="{ loading: isFetching }"
    :alt="$t('GLOBAL.LOGO_ALT')"
  >
</template>

<script setup>
import { useIsFetching } from '@tanstack/vue-query'
import { computed } from 'vue'

import carrotLogo from '@/logo/assets/carrot-logo.svg'

const logo = process.env.KARROT.THEME === 'dev' ? 'icons/dev.svg' : carrotLogo

const props = defineProps({
  showLoading: {
    type: Boolean,
    default: false,
  },
})

const activeQueryCount = useIsFetching()
const isFetching = computed(() => props.showLoading && activeQueryCount.value > 0)
</script>

<style scoped lang="sass">
@keyframes myanim
  0%, 100%
    opacity: .5
    transform: scale(.9)

  50%
    opacity: 1
    transform: scale(1)

img
  width: 100%
  height: 100%

.loading
  animation: myanim 1s cubic-bezier(.4, 0, .5, 1) infinite
</style>
