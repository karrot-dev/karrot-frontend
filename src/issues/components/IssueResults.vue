<template>
  <QCard>
    <QCardTitle>
      {{ $t('ISSUE.VOTING.TIME_UP') }}
    </QCardTitle>
    <QCardMain>
      <div class="no-wrap">
        <strong
          class="q-mr-sm"
        >
          {{ $t('ISSUE.VOTING.ENDED_AT', { date: $d(issue.votings.expiresAt, 'long') }) }}
        </strong>
      </div>
      <QItem>
        <small class="text-weight-light">
          <span>
            {{ $t('ISSUE.VOTING.INITIATED_BY', { initiatorName: issue.createdBy.displayName }) }}
            <DateAsWords :date="issue.createdAt" />
          </span>
        </small>
        <QItemMain/>
        <QItemSide
          v-if="issue.status === 'decided'"
          right
          stamp="Total score"
        />
      </QItem>
      <QItem
        v-if="issue.status === 'cancelled'"
      >
        <QItemMain>
          Unfortunately this conflict could not be decided. There are two possible reasons for that:
          <QItemTile
            class="q-pt-sm"
          >
            - the affected user left the group while the conflict resolution process was still going on<br>
            - nobody voted on this issue
          </QItemTile>
        </QItemMain>
      </QItem>
      <QList
        v-if="issue.status === 'decided'"
        no-border
      >
        <QItem
          v-for="(o, index) in sortedArray"
          :key="o.id"
        >
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
  QItemTile,
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
    QItemTile,
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
      return this.$t(`ISSUE.VOTING.${this.sortedArray[index].type.toUpperCase()}`, { userName: this.issue.affectedUser.displayName, groupName: this.issue.group.name })
    },
    getIcon (index) {
      if (this.sortedArray[index].sumScore > 0) {
        return 'fas fa-smile'
      }
      if (this.sortedArray[index].sumScore < 0) {
        return 'fas fa-frown'
      }
      return 'fas fa-meh'
    },
  },
}
</script>
