<template>
  <HistoryDetail :entry="historyItem" />
</template>

<script setup>
import HistoryDetail from '@/history/components/HistoryDetail'
import { useHistoryDetailQuery } from '@/history/queries'
import { useIntegerRouteParam } from '@/utils/composables'

const historyId = useIntegerRouteParam('historyId')
const {
  historyItem,
} = useHistoryDetailQuery({ historyId })
</script>
