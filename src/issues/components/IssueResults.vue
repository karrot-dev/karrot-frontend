<template>
  <QCard>
    <QCardTitle>
      {{ $t('ISSUE.VOTING.TIME_UP') }}
    </QCardTitle>
    <QCardMain>
      <div class="row no-wrap">
        <strong
          class="q-mr-sm"
          style="white-space: nowrap"
        >
          {{ $d(issue.votings.expiresAt, 'long') }}
        </strong>
      </div>
      <div class="row">
        <small class="text-weight-light">
          <span>
            {{ $t('ISSUE.VOTING.INITIATED_BY', { initiatorName: issue.createdBy.displayName }) }}
            <DateAsWords :date="issue.createdAt" />
          </span>
        </small>
      </div>
      <QList
        inset-separator
        no-border
      >
        <QItem>
          <QItemSide
            icon="fas fa-grin"
            color="secondary"
          />
          <QItemMain>
            {{ displayOutcomes(0) }}
          </QItemMain>
          <QItemSide>
            {{ sortedArray[0].sumScore }}
          </QItemSide>
        </QItem>
        <QItem>
          <QItemSide
            icon="fas fa-smile"
            color="primary"
          />
          <QItemMain>
            {{ displayOutcomes(1) }}
          </QItemMain>
          <QItemSide>
            {{ sortedArray[1].sumScore }}
          </QItemSide>
        </QItem>
        <QItem>
          <QItemSide
            icon="fas fa-frown"
            color="primary"
          />
          <QItemMain>
            {{ displayOutcomes(2) }}
          </QItemMain>
          <QItemSide>
            {{ sortedArray[2].sumScore }}
          </QItemSide>
        </QItem>
        <QItem>
          <QItemSide
            icon="fas fa-frown-open"
            color="primary"
          />
          <QItemMain>
            {{ displayOutcomes(3) }}
          </QItemMain>
          <QItemSide>
            {{ sortedArray[3].sumScore }}
          </QItemSide>
        </QItem>
      </QList>
    </QCardMain>
  </QCard>
</template>

<script>
import DateAsWords from '@/utils/components/DateAsWords'

import {
  QCard,
  QCardMain,
  QCardTitle,
  QList,
  QItem,
  QItemSide,
  QItemMain,
} from 'quasar'

export default {
  components: {
    QCard,
    QCardMain,
    QCardTitle,
    QList,
    QItem,
    QItemSide,
    QItemMain,
    DateAsWords,
  },
  props: {
    issue: {
      type: Object,
      required: true,
    },
  },
  computed: {
    sortedArray () {
      return this.issue.votings[0].options.slice().sort(function (a, b) {
        return b.sumScore - a.sumScore
      })
    },
  },
  methods: {
    displayOutcomes (index) {
      switch (this.sortedArray[index].type) {
        case 'furtherDiscussion':
          return this.$t('CONFLICT.VOTING.OPTION_FOUR')
        case 'removeUser':
          return this.$t('CONFLICT.VOTING.OPTION_THREE', { userName: this.issue.affectedUser.displayName, groupName: this.issue.group.displayName })
        case 'offlineMediation':
          return this.$t('CONFLICT.VOTING.OPTION_TWO')
        case 'noChange':
          return this.$t('CONFLICT.VOTING.OPTION_ONE', { userName: this.issue.affectedUser.displayName, groupName: this.issue.group.displayName })
      }
    },
  },
}
</script>
