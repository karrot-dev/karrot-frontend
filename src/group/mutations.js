import { useMutation } from 'vue-query'
import { withStatus } from '@/utils/queryHelpers'
import api from '@/group/api/groups'

export function useTrustUserMutation () {
  return withStatus(useMutation(
    ({ groupId, userId }) => api.trustUser(groupId, userId),
  ))
}

export function useRevokeTrustMutation () {
  return withStatus(useMutation(
    ({ groupId, userId }) => api.revokeTrust(groupId, userId),
  ))
}
