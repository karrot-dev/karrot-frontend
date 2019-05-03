<template>
  <QTabs
    align="justify"
    color="secondary"
  >
    <QRouteTab
      slot="title"
      :to="{ name: 'issueChat', params: { groupId, issueId } }"
      default
      name="chat"
      icon="fas fa-comments"
      :label="$q.platform.is.mobile ? '' : $t('ISSUE.CHAT')"
    />
    <QRouteTab
      slot="title"
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
