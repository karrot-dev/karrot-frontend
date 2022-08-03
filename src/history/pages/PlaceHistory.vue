<template>
  <div>
    <QCard
      class="no-shadow grey-border"
    >
      <div>
        <HistoryList
          class="padding-top"
          :history="history"
          :pending="isLoading"
          :can-fetch-past="hasNextPage"
          :fetch-past="() => fetchNextPage()"
        />
      </div>
    </QCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { QCard } from 'quasar'
import HistoryList from '@/history/components/HistoryList'

import { useActivePlaceService } from '@/places/services'
import { useHistoryListQuery } from '@/history/queries'
import { useHistoryEnricher } from '@/history/enrichers'

const enrichHistory = useHistoryEnricher()
const { placeId } = useActivePlaceService()

const {
  history: historyRaw,
  isLoading,
  hasNextPage,
  fetchNextPage,
} = useHistoryListQuery({
  placeId,
})

const history = computed(() => historyRaw.value.map(enrichHistory))
</script>

<style scoped lang="sass">
.padding-top
  padding-top: 15px
</style>
