<template>
  <QCollapsible>
    <template slot="header">
      <QItemSection>
        <QItemTile>
          {{ $t('ISSUE.VOTING.RESULTS.KEEP_DISCUSSING') }}
        </QItemTile>
        <QItemTile
          stamp
          class="text-weight-light"
        >
          <DateAsWords :date="voting.expiresAt" />
        </QItemTile>
      </QItemSection>
    </template>
    <VotingResults
      :voting="voting"
      :affected-user="affectedUser"
      :group-name="groupName"
    />
  </QCollapsible>
</template>

<script>
import {
  QItemSection,
  QItemLabel,
  QCollapsible,
} from 'quasar'

import DateAsWords from '@/utils/components/DateAsWords'
import VotingResults from './VotingResults'

export default {
  components: {
    QItemSection,
    QItemLabel,
    QCollapsible,
    DateAsWords,
    VotingResults,
  },
  props: {
    voting: {
      type: Object,
      default: null,
    },
    affectedUser: {
      type: Object,
      default: null,
    },
    groupName: {
      type: String,
      default: '',
    },
  },
}
</script>
