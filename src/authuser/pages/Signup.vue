<template>
  <Signup
    :status="signupStatus"
    :prefill-email="route.query.email"
    @submit="({ userData }) => signupThenLogin(userData)"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'

import { useLoginMutation, useSignupMutation } from '@/authuser/mutations'

import Signup from '@/authuser/components/Signup'

const route = useRoute()

const {
  mutateAsync: signup,
  status: signupStatus,
} = useSignupMutation()

const {
  mutateAsync: login,
} = useLoginMutation()

async function signupThenLogin (userData) {
  await signup(userData)
  await login({ email: userData.email, password: userData.password })
}
</script>
