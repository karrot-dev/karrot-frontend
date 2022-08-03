<template>
  <div>
    <QCard
      class="no-mobile-margin no-shadow grey-border"
    >
      <RandomArt
        v-if="$q.platform.is.desktop"
        :seed="groupId"
        type="circles"
      />
      <HistoryList
        class="padding-top"
        :history="history"
        :pending="isLoading"
        :can-fetch-past="hasNextPage"
        :fetch-past="() => fetchNextPage()"
      />
      <!-- TODO: what to do with fetch-past-status ? -->
    </QCard>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { QCard } from 'quasar'

import HistoryList from '@/history/components/HistoryList'
import RandomArt from '@/utils/components/RandomArt'

import { useCurrentGroupService } from '@/group/services'
import { useHistoryListQuery } from '@/history/queries'
import { useHistoryEnricher } from '@/history/enrichers'

const enrichHistory = useHistoryEnricher()
const { groupId } = useCurrentGroupService()
const {
  history: historyRaw,
  isLoading,
  hasNextPage,
  fetchNextPage,
} = useHistoryListQuery({
  groupId,
})

const history = computed(() => historyRaw.value.map(enrichHistory))
</script>

<style scoped lang="sass">
body.mobile .art-overlay
  width: 100%
  height: 30px
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.34) 0%, rgba(0, 0, 0, 0) 100%)

.padding-top
  padding-top: 10px
</style>
