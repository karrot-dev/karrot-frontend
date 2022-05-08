<template>
  <!-- we do not pass in the 'history' prop to keep this component versatile -->
  <HistoryList
    :status="$store.getters['history/fetchStatus']"
    :can-fetch-past="$store.getters['history/canFetchPast']"
    :fetch-past-status="$store.getters['history/fetchPastStatus']"
    :fetch-past="() => $store.dispatch('history/fetchPast')"
  />
</template>

<script>
import HistoryList from '@/history/components/HistoryList'

export default {
  components: {
    HistoryList,
  },
}
</script>
