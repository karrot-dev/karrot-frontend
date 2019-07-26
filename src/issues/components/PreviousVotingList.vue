<template>
  <QList
    v-if="votings && votings.length > 0"
    class="full-width"
  >
    <QItemLabel header>
      {{ $t('ISSUE.PREVIOUS_VOTINGS') }}
    </QItemLabel>
    <IssueHistoryItem
      v-for="voting in votings"
      :key="voting.id"
      :voting="voting"
      :affected-user="issue.affectedUser"
      :group-name="issue.group.name"
    />
  </QList>
</template>

<script>
import IssueHistoryItem from '@/issues/components/IssueHistoryItem'

import {
  QList,
  QItemLabel,
} from 'quasar'

export default {
  components: {
    IssueHistoryItem,
    QList,
    QItemLabel,
  },
  props: {
    votings: {
      type: Array,
      default: null,
    },
    issue: {
      type: Object,
      default: null,
    },
  },
}
</script>
