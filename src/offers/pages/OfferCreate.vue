<template>
  <OfferForm
    :status="{ validationErrors }"
    @save="data => mutate(data)"
    @reset="() => reset()"
  />
</template>

<script setup>
import OfferForm from '@/offers/components/OfferForm'
import { useCreateOfferMutation } from '@/offers/queries'

const {
  mutate,
  reset,
  validationErrors,
} = useCreateOfferMutation()
</script>
