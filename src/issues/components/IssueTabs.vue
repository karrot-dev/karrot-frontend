<template>
  <QTabs
    animated
    align="justify"
  >
    <QRouteTab
      :to="{ name: 'issueChat', params: { groupId, issueId } }"
      default
      slot="title"
      name="chat"
      icon="fas fa-comments"
    />
    <QRouteTab
      :to="{ name: 'issueVote', params: { groupId, issueId } }"
      slot="title"
      name="vote"
      icon="fas fa-vote-yea"
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
