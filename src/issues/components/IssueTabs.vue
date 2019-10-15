<template>
  <QTabs
    align="justify"
    class="bg-secondary text-white"
  >
    <QRouteTab
      :to="{ name: 'issueChat', params: { groupId, issueId } }"
      default
      name="chat"
      :icon="$icon('comments')"
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

<script>
import { mapGetters } from 'vuex'

import {
  QTabs,
  QRouteTab,
} from 'quasar'

export default {
  components: {
    QTabs,
    QRouteTab,
  },
  computed: {
    ...mapGetters({
      groupId: 'currentGroup/id',
      issueId: 'issues/currentId',
    }),
  },
}
</script>
