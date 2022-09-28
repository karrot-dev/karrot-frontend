<template>
  <AgreementForm
    :value="agreement"
    :status="saveStatus"
    @save="data => save(data)"
    @reset="reset"
  />
</template>

<script setup>
import { useSaveAgreementMutation } from '@/agreements/mutations'
import { useAgreementItemQuery } from '@/agreements/queries'
import { useIntegerRouteParam } from '@/utils/composables'

import AgreementForm from '@/agreements/components/AgreementForm'

const agreementId = useIntegerRouteParam('agreementId')

const { agreement } = useAgreementItemQuery({ agreementId })

const {
  mutate: save,
  status: saveStatus,
  reset,
} = useSaveAgreementMutation()
</script>
