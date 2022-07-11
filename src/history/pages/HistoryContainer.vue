<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<<<<<<< HEAD


=======
<template>
  <!-- we do not pass in the 'history' prop to keep this component versatile -->
  <HistoryList
    :status="$store.getters['history/fetchStatus']"
    :can-fetch-past="$store.getters['history/canFetchPast']"
    :fetch-past-status="$store.getters['history/fetchPastStatus']"
    :fetch-past="() => $store.dispatch('history/fetchPast')"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import HistoryList from '@/history/components/HistoryList'

export default {
  components: {
    HistoryList,
  },
}
</script>
