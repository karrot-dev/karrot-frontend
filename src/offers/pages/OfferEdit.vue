<template>
  <OfferForm
    :fetching="!offer || !offer.id"
    :value="offer"
    :status="{ validationErrors }"
    @save="data => mutate(data)"
    @reset="() => reset()"
  />
</template>

<script setup>
import OfferForm from '@/offers/components/OfferForm'
import { useCurrentOffer, useSaveOfferMutation } from '@/offers/queries'

const offer = useCurrentOffer()

const {
  mutate,
  reset,
  validationErrors,
} = useSaveOfferMutation()
</script>
