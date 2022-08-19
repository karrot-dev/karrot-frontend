<template>
  <IssueListUI
    :ongoing-issues="ongoingIssues"
    :past-issues="pastIssues"
    :is-pending="isLoadingOngoingIssues || isLoadingPastIssues"
  />
</template>

<script setup>
import { useCurrentGroupService } from '@/group/services'
import { useIssueListQuery } from '@/issues/queries'

import IssueListUI from '@/issues/components/IssueListUI'

const {
  groupId,
} = useCurrentGroupService()

const {
  issues: ongoingIssues,
  isLoading: isLoadingOngoingIssues,
} = useIssueListQuery({ groupId, status: 'ongoing' })

const {
  issues: pastIssues,
  isLoading: isLoadingPastIssues,
} = useIssueListQuery({ groupId, status: ['decided', 'cancelled'] })
</script>
