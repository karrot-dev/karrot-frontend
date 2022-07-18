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

const {
  mutate,
  reset,
  status,
} = useCreateOfferMutation()
</script>
