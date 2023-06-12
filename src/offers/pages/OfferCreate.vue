<template>
  <OfferForm
    :status="status"
    @save="offer => create(offer)"
    @reset="() => reset()"
  />
</template>

<script setup>
import { useCurrentGroupService } from '@/group/services'
import { useCreateOfferMutation } from '@/offers/mutations'

import OfferForm from '@/offers/components/OfferForm.vue'

const { groupId } = useCurrentGroupService()
const {
  mutate: create,
  reset,
  status,
} = useCreateOfferMutation({ groupId })
</script>
