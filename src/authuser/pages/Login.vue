<template>
  <Login
    :status="status"
    @submit="data => login(data)"
  />
</template>

<script setup>
import Login from '@/authuser/components/Login'
import { useLoginMutation } from '@/authuser/mutations'

const {
  mutate: login,
  status,
} = useLoginMutation()
</script>
