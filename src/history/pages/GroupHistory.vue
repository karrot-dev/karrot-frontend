<template>
  <div>
    <HistoryFilter
      v-model="typus"
    />
    <QCard
      class="no-mobile-margin no-shadow"
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
import { QCard } from 'quasar'
import { ref } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { useHistoryListQuery } from '@/history/queries'

import HistoryFilter from '@/history/components/HistoryFilter.vue'
import HistoryList from '@/history/components/HistoryList.vue'
import RandomArt from '@/utils/components/RandomArt.vue'

const typus = ref(null)

const { groupId } = useCurrentGroupService()
const {
  history,
  isLoading,
  hasNextPage,
  fetchNextPage,
} = useHistoryListQuery({
  groupId,
  typus,
})
</script>

<style scoped lang="sass">
body.mobile .art-overlay
  width: 100%
  height: 30px
  background: linear-gradient(to bottom, rgba(0, 0, 0, 0.34) 0%, rgba(0, 0, 0, 0) 100%)

.padding-top
  padding-top: 10px
</style>
