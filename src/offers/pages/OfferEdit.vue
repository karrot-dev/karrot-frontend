<template>
  <OfferForm
    :fetching="isLoading"
    :value="offer"
    :status="status"
    @save="offer => save(offer)"
    @reset="() => reset()"
  />
</template>

<script setup>
import { useSaveOfferMutation } from '@/offers/mutations'
import { useActiveOfferService } from '@/offers/services'

import OfferForm from '@/offers/components/OfferForm'

const { offer, isLoading } = useActiveOfferService()

const {
  mutate: save,
  reset,
  status,
} = useSaveOfferMutation()
</script>
