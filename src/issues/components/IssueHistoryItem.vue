<template>
  <QExpansionItem>
    <template slot="header">
      <QItemSection>
        <QItemLabel>
          {{ $t('ISSUE.VOTING.RESULTS.KEEP_DISCUSSING') }}
        </QItemLabel>
        <QItemLabel
          side
          class="text-weight-light"
        >
          <DateAsWords :date="voting.expiresAt" />
        </QItemLabel>
      </QItemSection>
    </template>
    <VotingResults
      :voting="voting"
      :affected-user="affectedUser"
      :group-name="groupName"
    />
  </QExpansionItem>
</template>

<script>
import {
  QItemSection,
  QItemLabel,
  QExpansionItem,
} from 'quasar'

import DateAsWords from '@/utils/components/DateAsWords'
import VotingResults from './VotingResults'

export default {
  components: {
    QItemSection,
    QItemLabel,
    QExpansionItem,
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
