<template>
  <div v-if="issue">
    <QCard
      v-if="issue.isOngoing"
      class="no-shadow"
    >
      <IssueVote
        :issue="issue"
        @saveScores="saveScores"
      />
      <QList
        v-if="multipleVotings"
      >
        <IssueHistoryItem
          v-for="v in allPastVotings"
          :key="v.id"
          :voting="v"
          :is-cancelled="issue.isCancelled"
        />
      </QList>
    </QCard>

    <QCard
      v-else
    >
      <QCardTitle>
        {{ $t('ISSUE.VOTING.RESULTS.TIME_UP') }}
      </QCardTitle>
      <QCardMain>
        <VotingResults
          :voting="newestVoting"
          :affected-user="issue.affectedUser"
          :group-name="issue.group.name"
          :is-cancelled="issue.isCancelled"
        />
        <QList
          v-if="multipleVotings"
        >
          <IssueHistoryItem
            v-for="v in olderVotings"
            :key="v.id"
            :voting="v"
            :affected-user="issue.affectedUser"
            :group-name="issue.group.name"
            :is-cancelled="issue.isCancelled"
          />
        </QList>
      </QCardMain>
    </QCard>
  </div>
</template>

<script>
import IssueVote from '@/issues/components/IssueVote'
import VotingResults from '@/issues/components/VotingResults'
import IssueHistoryItem from '@/issues/components/IssueHistoryItem'
import reactiveNow from '@/utils/reactiveNow'

import { mapGetters, mapActions } from 'vuex'

import {
  QList,
  QCard,
  QCardMain,
  QCardTitle,
} from 'quasar'

export default {
  components: {
    IssueVote,
    VotingResults,
    IssueHistoryItem,
    QList,
    QCard,
    QCardMain,
    QCardTitle,
  },
  computed: {
    ...mapGetters({
      issue: 'issues/current',
    }),
    newestVoting () {
      if (!this.issue) return
      const tempArray = this.issue.votings.slice().sort((a, b) => new Date(b.expiresAt) - new Date(a.expiresAt))
      return tempArray[0]
    },
    multipleVotings () {
      if (!this.issue) return
      return this.issue.votings.length > 1
    },
    allPastVotings () {
      if (!this.issue) return
      return this.issue.votings.filter(v => v.expiresAt <= reactiveNow.value)
    },
    olderVotings () {
      return this.allPastVotings.filter(v => v.id !== this.newestVoting.id)
    },
  },
  methods: {
    ...mapActions({
      saveScores: 'issues/saveScores',
    }),
  },
}
</script>
