<template>
  <QCard>
    <QCardTitle>
      {{ $t('ISSUE.VOTING.RESULTS.TIME_UP') }}
    </QCardTitle>
    <QCardMain>
      <div>
        <strong
          class="q-mr-sm"
        >
          {{ $t('ISSUE.VOTING.RESULTS.ENDED_AT', { date: $d(issue.votings.expiresAt, 'long') }) }}
        </strong>
      </div>
      <div
        class="q-pt-xs"
      >
        {{ $t('ISSUE.VOTING.RESULTS.PARTICIPANTS', { number: lastDecision.participantCount }) }}
      </div>
      <QItem>
        <small class="text-weight-light">
          <span>
            {{ $t('ISSUE.INITIATED_BY', { initiatorName: issue.createdBy.displayName }) }}
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
          <strong>
            {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED') }}
          </strong>
          <QItemTile
            class="q-pt-sm"
          >
            {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED_WHY') }}
            <ul>
              <li>
                {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED_REASON_1') }}
              </li>
              <li>
                {{ $t('ISSUE.VOTING.RESULTS.UNDECIDED_REASON_2') }}
              </li>
            </ul>
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
import max from 'date-fns/max'

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
    lastDecision () {
      return this.issue.votings.find(v => max(v.expiredAt))
    },
    sortedArray () {
      return this.lastDecision.options.slice().sort(function (a, b) {
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
