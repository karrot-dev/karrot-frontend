<template>
  <ApplicationList
    :is-loading="isLoading"
    :pending-applications="pendingApplications"
    :other-applications="otherApplications"
    :can-fetch-past="hasNextPage"
    :fetch-past="() => fetchNextPage()"
  />
</template>

<script setup>
import ApplicationList from '@/applications/components/ApplicationList'

import { computed } from 'vue'

import { useApplicationListQuery } from '@/applications/queries'
import { useCurrentGroupService } from '@/group/services'

const { groupId } = useCurrentGroupService()
const {
  applications,
  isLoading,
  hasNextPage,
  fetchNextPage,
} = useApplicationListQuery({
  groupId,
})

const pendingApplications = computed(() => applications.value.filter(a => a.status === 'pending'))
const otherApplications = computed(() => applications.value.filter(a => a.status !== 'pending'))
</script>
