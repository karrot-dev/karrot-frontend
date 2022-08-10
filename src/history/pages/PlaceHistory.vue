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
import { QCard } from 'quasar'
import HistoryList from '@/history/components/HistoryList'

import { useActivePlaceService } from '@/places/services'
import { useHistoryListQuery } from '@/history/queries'

const { placeId } = useActivePlaceService()

const {
  history,
  isLoading,
  hasNextPage,
  fetchNextPage,
} = useHistoryListQuery({
  placeId,
})
</script>

<style scoped lang="sass">
.padding-top
  padding-top: 15px
</style>
