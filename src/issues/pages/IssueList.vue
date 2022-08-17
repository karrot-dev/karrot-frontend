<template>
  <IssueListUI
    :ongoing-issues="ongoingIssues"
    :past-issues="pastIssues"
    :is-pending="isLoadingOngoingIssues || isLoadingPastIssues"
  />
</template>

<script setup>
import IssueListUI from '@/issues/components/IssueListUI'
import { useIssueListQuery } from '@/issues/queries'
import { useCurrentGroupService } from '@/group/services'

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
