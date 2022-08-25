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

import { computed } from 'vue'

import { useApplicationListQuery } from '@/applications/queries'
import { useCurrentGroupService } from '@/group/services'

import ApplicationList from '@/applications/components/ApplicationList'

const { groupId } = useCurrentGroupService()
const {
  applications,
  isLoading,
  hasNextPage,
  fetchNextPage,
} = useApplicationListQuery({
  groupId,
}, {
  keepPreviousData: true,
})

const pendingApplications = computed(() => applications.value.filter(a => a.status === 'pending'))
const otherApplications = computed(() => applications.value.filter(a => a.status !== 'pending'))
</script>
