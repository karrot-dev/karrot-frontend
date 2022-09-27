<template>
  <SidenavGroupUI
    :group-id="groupId"
    :theme="theme"
    :features="features"
    :wall-unread-count="status.unreadWallMessageCount"
    :feedback-possible-count="status.feedbackPossibleCount"
    :pending-application-count="status.pendingApplicationCount"
    :ongoing-issue-count="status.ongoingIssueCount"
  />
</template>

<script setup>
import { computed } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { useStatusService } from '@/status/services'

import SidenavGroupUI from './SidenavGroupUI'

const {
  groupId,
  theme,
  features,
} = useCurrentGroupService()

const { getGroupStatus } = useStatusService()

const status = computed(() => getGroupStatus(groupId.value))
</script>
