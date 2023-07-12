<template>
  <QLinearProgress
    v-if="isFetching"
    indeterminate
    color="info"
    class="fixed-top"
    style=" z-index: 2500;height: 2px"
  />
</template>

<script setup>
import { useIsFetching } from '@tanstack/vue-query'
import { QLinearProgress } from 'quasar'
import { computed } from 'vue'

const activeQueryCount = useIsFetching()
const isFetching = computed(() => activeQueryCount.value > 0)
</script>
