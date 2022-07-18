<template>
  <OfferForm
    :fetching="isLoading"
    :value="offer"
    :status="status"
    @save="data => mutate(data)"
    @reset="() => reset()"
  />
</template>

<script setup>
import OfferForm from '@/offers/components/OfferForm'
import { useCurrentOfferQuery } from '@/offers/queries'
import { useSaveOfferMutation } from '@/offers/mutations'

const { offer, isLoading } = useCurrentOfferQuery()

const {
  mutate,
  reset,
  status,
} = useSaveOfferMutation()
</script>
