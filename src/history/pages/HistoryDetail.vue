<template>
  <HistoryDetail :entry="historyItem" />
</template>

<script setup>
import { useHistoryDetailQuery } from '@/history/queries'
import { useIntegerRouteParam } from '@/utils/composables'

import HistoryDetail from '@/history/components/HistoryDetail.vue'

const historyId = useIntegerRouteParam('historyId')
const {
  historyItem,
} = useHistoryDetailQuery({ historyId })
</script>
