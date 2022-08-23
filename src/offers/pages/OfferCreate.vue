<template>
  <OfferForm
    :status="status"
    @save="offer => create(offer)"
    @reset="() => reset()"
  />
</template>

<script setup>
// eslint-disable-next-line no-unused-vars
import Vue from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { useCreateOfferMutation } from '@/offers/mutations'

import OfferForm from '@/offers/components/OfferForm'

const { groupId } = useCurrentGroupService()
const {
  mutate: create,
  reset,
  status,
} = useCreateOfferMutation({ groupId })
</script>
