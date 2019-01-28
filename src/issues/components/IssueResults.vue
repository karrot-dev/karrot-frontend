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
        no-border
        v-for="(o, index) in sortedArray"
        :key="o.id"
        inset-separator
      >
        <QItem>
          <QItemSide
            :icon="getIcon(index)"
            color="primary"
          />
          <QItemMain>
            {{ displayOutcomes(index) }}
          </QItemMain>
          <QItemSide>
            {{ sortedArray[index].sumScore }}
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
          return this.$t('ISSUE.VOTING.CONFLICT_ONE')
        case 'removeUser':
          return this.$t('ISSUE.VOTING.CONFLICT_THREE', { userName: this.issue.affectedUser.displayName, groupName: this.issue.group.displayName })
        case 'noChange':
          return this.$t('ISSUE.VOTING.CONFLICT_TWO', { userName: this.issue.affectedUser.displayName, groupName: this.issue.group.displayName })
      }
    },
    getIcon (index) {
      if (this.sortedArray.length === 2) {
        switch (index) {
          case 0:
            return 'fas fa-smile'
          case 1:
            return 'fas fa-frown'
        }
      }
      else if (this.sortedArray.length === 3) {
        switch (index) {
          case 0:
            return 'fas fa-smile'
          case 1:
            return 'fas fa-meh'
          case 2:
            return 'fas fa-frown'
        }
      }
    },
  },
}
</script>