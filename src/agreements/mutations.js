import { unref } from 'vue'
import { useMutation } from 'vue-query'
import { useRouter } from 'vue-router'

import api from '@/agreements/api/agreements'
import { withStatus } from '@/utils/queryHelpers'

export function useCreateAgreementMutation ({ groupId }) {
  const router = useRouter()
  return withStatus(useMutation(
    agreement => api.create({ ...agreement, group: unref(groupId) }),
    {
      onSuccess (createdAgreement) {
        router.push({ name: 'agreement', params: { agreementId: createdAgreement.id } })
      },
    },
  ))
}

export function useSaveAgreementMutation () {
  const router = useRouter()
  return withStatus(useMutation(
    agreement => api.save(agreement),
    {
      onSuccess (updatedAgreement) {
        router.push({ name: 'agreement', params: { agreementId: updatedAgreement.id } })
      },
    },
  ))
}
