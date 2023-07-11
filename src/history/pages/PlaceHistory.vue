<template>
  <div>
    <HistoryFilter
      v-model="typus"
      for="place"
    />
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
import { ref } from 'vue'

import { useHistoryListQuery } from '@/history/queries'
import { useActivePlaceService } from '@/places/services'

import HistoryFilter from '@/history/components/HistoryFilter.vue'
import HistoryList from '@/history/components/HistoryList.vue'

const { placeId } = useActivePlaceService()

const typus = ref(null)

const {
  history,
  isLoading,
  hasNextPage,
  fetchNextPage,
} = useHistoryListQuery({
  placeId,
  typus,
})
</script>

<style scoped lang="sass">
.padding-top
  padding-top: 15px
</style>
