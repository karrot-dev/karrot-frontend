<template>
  <AgreementForm
    :status="createStatus"
    @save="data => create(data)"
    @reset="reset"
    @cancel="router.push({ name: 'agreements' })"
  />
</template>

<script setup>
import { useRouter } from 'vue-router'

import { useCreateAgreementMutation } from '@/agreements/mutations'
import { useCurrentGroupService } from '@/group/services'

import AgreementForm from '@/agreements/components/AgreementForm.vue'

const router = useRouter()

const { groupId } = useCurrentGroupService()

const {
  mutate: create,
  status: createStatus,
  reset,
} = useCreateAgreementMutation({ groupId })
</script>
