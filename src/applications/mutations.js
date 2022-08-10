import { useMutation } from 'vue-query'
import api from '@/applications/api/applications'
import { withStatus } from '@/utils/queryHelpers'

export function useCreateApplicationMutation () {
  const mutation = useMutation(
    application => api.create(application),
  )
  return withStatus(mutation)
}

export function useWithdrawApplicationMutation () {
  const mutation = useMutation(
    id => api.withdraw(id),
  )
  return withStatus(mutation)
}

export function useAcceptApplicationMutation () {
  const mutation = useMutation(
    id => api.accept(id),
  )
  return withStatus(mutation)
}

export function useDeclineApplicationMutation () {
  const mutation = useMutation(
    id => api.decline(id),
  )
  return withStatus(mutation)
}
