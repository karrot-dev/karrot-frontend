import { unref } from 'vue'
import { useMutation } from 'vue-query'

import api from '@/issues/api/issues'

import { withStatus } from '@/utils/queryHelpers'
import { showToast } from '@/utils/toasts'
import router from '@/router'

export function useCreateIssueMutation () {
  return withStatus(useMutation(
    data => api.create(data),
    {
      onSuccess (newIssue) {
        showToast({
          message: 'ISSUE.CREATION.TOAST',
        })
        router.push({ name: 'issueDetail', params: { groupId: newIssue.group, issueId: newIssue.id } })
      },
    },
  ))
}

export function useSaveVoteMutation ({ issueId }) {
  return withStatus(useMutation(
    results => api.vote(unref(issueId), results),
    {
      onSuccess () {
        showToast({
          message: 'ISSUE.VOTING.TOAST',
        })
      },
    },
  ))
}

export function useDeleteVoteMutation ({ issueId }) {
  return withStatus(useMutation(
    () => api.deleteVote(unref(issueId)),
    {
      onSuccess () {
        showToast({
          message: 'ISSUE.VOTING.TOAST_DELETE',
        })
      },
    },
  ))
}
