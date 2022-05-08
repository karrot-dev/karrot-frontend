<template>
  <HistoryDetail
    :entry="$store.getters['history/active']"
  />
</template>

<script>
import HistoryDetail from '@/history/components/HistoryDetail'

export default {
  components: {
    HistoryDetail,
  },
}
</script>
