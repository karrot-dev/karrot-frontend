<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<<<<<<< HEAD


=======
<template>
  <IssueListUI
    :ongoing-issues="$store.getters['issues/ongoing']"
    :past-issues="$store.getters['issues/past']"
    :status="$store.getters['issues/fetchByGroupIdStatus']"
    @clear-detail="data => $store.dispatch('detail/clear', data)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import IssueListUI from '@/issues/components/IssueListUI'

export default {
  components: {
    IssueListUI,
  },
}
</script>
