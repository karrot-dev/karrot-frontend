<template>
  <QList
    v-if="votings && votings.length > 0"
  >
    <QListHeader>
      {{ $t('ISSUE.PREVIOUS_VOTINGS') }}
    </QListHeader>
    <IssueHistoryItem
      v-for="v in votings"
      :key="v.id"
      :voting="v"
      :affected-user="issue.affectedUser"
      :is-cancelled="issue.isCancelled"
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
