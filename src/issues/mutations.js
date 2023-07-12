import { useMutation } from '@tanstack/vue-query'
import { unref } from 'vue'
import { useRouter } from 'vue-router'

import api from '@/issues/api/issues'
import { withStatus } from '@/utils/queryHelpers'
import { showToast } from '@/utils/toasts'

export function useCreateIssueMutation () {
  const router = useRouter()
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
