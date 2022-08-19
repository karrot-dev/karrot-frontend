<template>
  <QTabs
    align="justify"
    class="bg-secondary text-white"
    inline-label
  >
    <QRouteTab
      :to="{ name: 'issueChat', params: { groupId, issueId } }"
      default
      name="chat"
      icon="fas fa-comments"
      :label="$q.platform.is.mobile ? '' : $t('ISSUE.CHAT')"
    />
    <QRouteTab
      :to="{ name: 'issueVote', params: { groupId, issueId } }"
      name="vote"
      icon="fas fa-vote-yea"
      :label="$q.platform.is.mobile ? '' : $t('ISSUE.VOTE')"
    />
  </QTabs>
</template>

<script setup>
import {
  QTabs,
  QRouteTab,
} from 'quasar'

import { useCurrentGroupService } from '@/group/services'
import { useActiveIssueService } from '@/issues/services'

const { groupId } = useCurrentGroupService()
const { issueId } = useActiveIssueService()
</script>
