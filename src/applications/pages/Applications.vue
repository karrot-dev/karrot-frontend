<template>
  <ApplicationList
    :pending="$store.getters['applications/forCurrentGroupPending']"
    :other-applications="$store.getters['applications/forCurrentGroupNonPending']"
    :can-fetch-past="$store.getters['applications/canFetchPast']"
    :fetch-past-status="$store.getters['applications/fetchPastStatus']"
    :fetch-past="() => $store.dispatch('applications/fetchPast')"
    @accept="data => $store.dispatch('applications/accept', data)"
    @decline="data => $store.dispatch('applications/decline', data)"
    @open-chat="data => $store.dispatch('detail/openForApplication', data)"
  />
</template>

<script>
import ApplicationList from '@/applications/components/ApplicationList'

export default {
  components: {
    ApplicationList,
  },
}
</script>
