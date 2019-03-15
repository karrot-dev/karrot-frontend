<template>
  <QTabs
    align="justify"
    color="secondary"
  >
    <QRouteTab
      :to="{ name: 'issueChat', params: { groupId, issueId } }"
      default
      slot="title"
      name="chat"
      icon="fas fa-comments"
      :label="$q.platform.is.mobile ? '' : $t('ISSUE.CHAT')"
    />
    <QRouteTab
      :to="{ name: 'issueVote', params: { groupId, issueId } }"
      slot="title"
      name="vote"
      icon="fas fa-vote-yea"
      :label="$q.platform.is.mobile ? '' : $t('ISSUE.VOTE')"
    />
  </QTabs>
</template>

<script>
import { mapState } from 'vuex'

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
    ...mapState({
      groupId: state => state.currentGroup.id,
      issueId: state => state.issues.currentId,
    }),
  },
}
</script>
