import { useAgreementItemQuery } from '@/agreements/queries'
import { useIntegerRouteParam } from '@/utils/composables'
import { defineService } from '@/utils/datastore/helpers'

export const useActiveAgreementService = defineService(() => {
  const agreementId = useIntegerRouteParam('agreementId')

  const {
    agreement,
    isLoading,
  } = useAgreementItemQuery({ agreementId })

  return {
    agreement,
    isLoading,
  }
})
