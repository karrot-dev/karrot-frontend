<template>
  <PasswordReset
    :status="status"
    :code="route.query.code"
    @submit="data => reset(data)"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'

import { usePasswordResetMutation } from '@/authuser/mutations'

import PasswordReset from '@/authuser/components/PasswordReset'

const route = useRoute()

const {
  mutate: reset,
  status,
} = usePasswordResetMutation()
</script>
