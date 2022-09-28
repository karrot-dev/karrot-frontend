<template>
  <AgreementForm
    :status="createStatus"
    @save="data => create(data)"
    @reset="reset"
  />
</template>

<script setup>
import { useCreateAgreementMutation } from '@/agreements/mutations'
import { useCurrentGroupService } from '@/group/services'

import AgreementForm from '@/agreements/components/AgreementForm'

const { groupId } = useCurrentGroupService()

const {
  mutate: create,
  status: createStatus,
  reset,
} = useCreateAgreementMutation({ groupId })
</script>
