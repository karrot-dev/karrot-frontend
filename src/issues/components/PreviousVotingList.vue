<template>
  <QList
    v-if="votings && votings.length > 0"
    class="full-width"
  >
    <QListHeader>
      {{ $t('ISSUE.PREVIOUS_VOTINGS') }}
    </QListHeader>
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
  QListHeader,
} from 'quasar'

export default {
  components: {
    IssueHistoryItem,
    QList,
    QListHeader,
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
