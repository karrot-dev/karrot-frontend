<template>
  <OfferForm
    :status="status"
    @save="data => mutate(data)"
    @reset="() => reset()"
  />
</template>

<script setup>
import OfferForm from '@/offers/components/OfferForm'
import { useCreateOfferMutation } from '@/offers/mutations'
import { useCurrentGroupService } from '@/group/services'

const { groupId } = useCurrentGroupService()
const {
  mutate,
  reset,
  status,
} = useCreateOfferMutation({ groupId })
</script>
