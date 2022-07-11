<template>
  <OfferForm
    :fetching="isFetching"
    :value="offer"
    :status="status"
    @save="data => mutate(data)"
    @reset="() => reset()"
  />
</template>

<script setup>
import OfferForm from '@/offers/components/OfferForm'
import { useCurrentOfferQuery, useSaveOfferMutation } from '@/offers/queries'

const { offer, isFetching } = useCurrentOfferQuery()

const {
  mutate,
  reset,
  status,
} = useSaveOfferMutation()
</script>
