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

import { useHistoryListQuery } from '@/history/queries'
import { useActivePlaceService } from '@/places/services'

import HistoryList from '@/history/components/HistoryList'

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
