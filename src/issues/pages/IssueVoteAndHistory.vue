<template>
  <QList
    v-if="issue"
    class="bg-white"
    style="overflow-x: hidden"
  >
    <template v-if="issue.isOngoing">
      <QItem>
        <IssueVote
          v-if="issue.isOngoing"
          :issue="issue"
          :status="saveVoteStatus"
          @save="saveVote"
          @delete="deleteVote"
        />
      </QItem>
      <QItem>
        <PreviousVotingList
          :votings="allPastVotings"
          :issue="issue"
        />
      </QItem>
    </template>
    <template v-else>
      <QItem class="q-title">
        {{ $t('ISSUE.VOTING.RESULTS.TIME_UP') }}
      </QItem>
      <QItem>
        <VotingResults
          :voting="newestVoting"
          :affected-user="issue.affectedUser"
          :group-name="issue.group.name"
          :is-cancelled="issue.isCancelled"
        />
      </QItem>
      <QItem>
        <PreviousVotingList
          :votings="olderVotings"
          :issue="issue"
        />
      </QItem>
    </template>
  </QList>
</template>

<script>
import IssueVote from '@/issues/components/IssueVote'
import VotingResults from '@/issues/components/VotingResults'
import PreviousVotingList from '@/issues/components/PreviousVotingList'
import reactiveNow from '@/utils/reactiveNow'

import { mapGetters, mapActions } from 'vuex'

import {
  QList,
  QItem,
} from 'quasar'

export default {
  components: {
    IssueVote,
    VotingResults,
    PreviousVotingList,
    QList,
    QItem,
  },
  computed: {
    ...mapGetters({
      issue: 'issues/current',
      saveVoteStatus: 'issues/saveVoteStatus',
    }),
    sortedVotings () {
      if (!this.issue) return []
      return this.issue.votings.slice().sort((a, b) => b.expiresAt - a.expiresAt)
    },
    newestVoting () {
      if (this.sortedVotings.length < 1) return
      return this.sortedVotings[0]
    },
    allPastVotings () {
      return this.sortedVotings.filter(v => v.expiresAt <= reactiveNow.value)
    },
    olderVotings () {
      return this.allPastVotings.filter(v => v.id !== this.newestVoting.id)
    },
  },
  methods: {
    ...mapActions({
      saveVote: 'issues/saveVote',
      deleteVote: 'issues/deleteVote',
    }),
  },
}
</script>
