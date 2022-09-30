<template>
  <AgreementForm
    :value="agreement"
    :status="saveStatus"
    @save="data => save(data)"
    @reset="reset"
    @cancel="router.push({ name: 'agreement', params: { agreementId: agreement.id } })"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'

import { useSaveAgreementMutation } from '@/agreements/mutations'
import { useAgreementItemQuery } from '@/agreements/queries'
import { useIntegerRouteParam } from '@/utils/composables'

import AgreementForm from '@/agreements/components/AgreementForm'

const router = useRouter()

const agreementId = useIntegerRouteParam('agreementId')

const { agreement } = useAgreementItemQuery({ agreementId })

const {
  mutate: save,
  status: saveStatus,
  reset,
} = useSaveAgreementMutation()
</script>
