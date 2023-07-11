<template>
  <Login
    :status="status"
    @submit="data => login(data)"
  />
</template>

<script setup>
import { useLoginMutation } from '@/authuser/mutations'

import Login from '@/authuser/components/Login.vue'

const {
  mutate: login,
  status,
} = useLoginMutation()
</script>
