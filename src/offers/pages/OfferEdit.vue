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
import OfferForm from '@/offers/components/OfferForm'
import { useSaveOfferMutation } from '@/offers/mutations'
import { useActiveOfferService } from '@/offers/services'

const { offer, isLoading } = useActiveOfferService()

const {
  mutate: save,
  reset,
  status,
} = useSaveOfferMutation()
</script>
