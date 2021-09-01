<template>
  <IssueListUI
    :ongoing-issues="$store.getters['issues/ongoing']"
    :past-issues="$store.getters['issues/past']"
    :status="$store.getters['issues/fetchByGroupIdStatus']"
    @clear-detail="data => $store.dispatch('detail/clear', data)"
  />
</template>

<script>
import IssueListUI from '@/issues/components/IssueListUI'

export default {
  components: {
    IssueListUI,
  },
}
</script>
