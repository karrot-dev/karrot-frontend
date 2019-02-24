<template>
  <QTabs
    animated
    align="justify"
  >
    <QRouteTab
      :to="{ name: 'issueChat' }"
      default
      slot="title"
      name="chat"
      icon="fas fa-comments"
    />
    <QRouteTab
      :to="{ name: 'issueVote' }"
      slot="title"
      name="vote"
      icon="fas fa-vote-yea"
    />
  </QTabs>
</template>

<script>
import {
  QTabs,
  QRouteTab,
} from 'quasar'

export default {
  components: {
    QTabs,
    QRouteTab,
  },
}
</script>
