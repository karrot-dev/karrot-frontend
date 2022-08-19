<template>
  <RequestPasswordReset
    :status="status"
    @submit="data => request(data)"
  />
</template>

<script setup>
import { useRequestPasswordResetMutation } from '@/authuser/mutations'

import RequestPasswordReset from '@/authuser/components/RequestPasswordReset'

const {
  mutate: request,
  status,
} = useRequestPasswordResetMutation()
</script>
