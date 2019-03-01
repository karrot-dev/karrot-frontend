<template>
  <QCollapsible>
    <template slot="header">
      <QItemMain>
        <QItemTile>
          {{ $t('ISSUE.VOTING.RESULTS.KEEP_DISCUSSING') }}
        </QItemTile>
        <QItemTile
          stamp
          class="mobile-only text-weight-light"
        >
          <DateAsWords :date="voting.expiresAt" />
        </QItemTile>
      </QItemMain>
      <QItemSide
        class="desktop-only"
        stamp
        right
      >
        <DateAsWords :date="voting.expiresAt" />
      </QItemSide>
    </template>
    <VotingResults
      :voting="voting"
      :affected-user="affectedUser"
      :group-name="groupName"
      :is-cancelled="isCancelled"
    />
  </QCollapsible>
</template>

<script>
import {
  QItemSide,
  QItemMain,
  QItemTile,
  QCollapsible,
} from 'quasar'

import DateAsWords from '@/utils/components/DateAsWords'
import VotingResults from './VotingResults'

export default {
  components: {
    QItemSide,
    QItemMain,
    QItemTile,
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
    isCancelled: {
      type: Boolean,
      default: false,
    },
  },
}
</script>
