<template>
  <ApplicationList
    :is-loading="isLoading"
    :pending-applications="pendingApplications"
    :other-applications="otherApplications"
    :can-fetch-past="hasNextPage"
    :fetch-past="() => fetchNextPage()"
    @accept="data => $store.dispatch('applications/accept', data)"
    @decline="data => $store.dispatch('applications/decline', data)"
    @open-chat="data => $store.dispatch('detail/openForApplication', data)"
  />
</template>

<script setup>
import ApplicationList from '@/applications/components/ApplicationList'

import { computed } from 'vue'

import { useApplicationListQuery } from '@/applications/queries'
import { useCurrentGroupService } from '@/group/services'
import { useUserService } from '@/users/services'
import { useUserEnricher } from '@/users/enrichers'

const { groupId } = useCurrentGroupService()
const {
  applications: applicationsRaw,
  isLoading,
  hasNextPage,
  fetchNextPage,
} = useApplicationListQuery({
  groupId,
})

const { getUserById } = useUserService()

const enrichUser = useUserEnricher()

const enrich = application => {
  // only enriching some bits, could be moved down into components
  return application && {
    ...application,
    user: enrichUser(getUserById(application.user.id)),
    decidedBy: enrichUser(getUserById(application.decidedBy)),
  }
}

const enrichedApplications = computed(() => applicationsRaw.value.map(enrich))

const pendingApplications = computed(() => enrichedApplications.value.filter(a => a.status === 'pending'))
const otherApplications = computed(() => enrichedApplications.value.filter(a => a.status !== 'pending'))
</script>
