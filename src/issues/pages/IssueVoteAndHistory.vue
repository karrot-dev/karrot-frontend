<template>
  <QList
    v-if="issue"
    class="bg-white"
    style="overflow-x: hidden"
  >
    <template v-if="issue.status === 'ongoing'">
      <QItem>
        <IssueVote
          :issue="issue"
          :group="group"
          :affected-user="affectedUser"
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
      <QItem class="text-h6">
        {{ $t('ISSUE.VOTING.RESULTS.TIME_UP') }}
      </QItem>
      <QItem>
        <VotingResults
          :voting="newestVoting"
          :affected-user="affectedUser"
          :group-name="group.name"
          :is-cancelled="issue.status === 'cancelled'"
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
import {
  QList,
  QItem,
} from 'quasar'
import { computed } from 'vue'

import { useGroupInfoService } from '@/groupInfo/services'
import { useDeleteVoteMutation, useSaveVoteMutation } from '@/issues/mutations'
import { useActiveIssueService } from '@/issues/services'
import { useUserService } from '@/users/services'
import reactiveNow from '@/utils/reactiveNow'

import IssueVote from '@/issues/components/IssueVote.vue'
import PreviousVotingList from '@/issues/components/PreviousVotingList.vue'
import VotingResults from '@/issues/components/VotingResults.vue'

export default {
  components: {
    IssueVote,
    VotingResults,
    PreviousVotingList,
    QList,
    QItem,
  },
  setup () {
    const {
      issueId,
      issue,
    } = useActiveIssueService()

    const { getUserById } = useUserService()
    const { getGroupById } = useGroupInfoService()

    const affectedUser = computed(() => getUserById(issue.value.affectedUser))
    const group = computed(() => getGroupById(issue.value.group))

    const {
      mutate: saveVote,
      status: saveVoteStatus,
    } = useSaveVoteMutation({ issueId })

    const {
      mutate: deleteVote,
    } = useDeleteVoteMutation({ issueId })

    return {
      issue,
      affectedUser,
      group,
      saveVote,
      saveVoteStatus,
      deleteVote,
    }
  },
  computed: {
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
}
</script>
