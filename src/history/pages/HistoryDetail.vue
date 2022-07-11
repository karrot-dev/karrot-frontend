<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<<<<<<< HEAD


=======
<template>
  <HistoryDetail
    :entry="$store.getters['history/active']"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import HistoryDetail from '@/history/components/HistoryDetail'

export default {
  components: {
    HistoryDetail,
  },
}
</script>
