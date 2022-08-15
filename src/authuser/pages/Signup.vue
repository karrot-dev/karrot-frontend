<template>
  <Signup
    :status="signupStatus"
    :prefill-email="route.query.email"
    @submit="({ userData }) => signupThenLogin(userData)"
  />
</template>

<script setup>
import Signup from '@/authuser/components/Signup'
import { useLoginMutation, useSignupMutation } from '@/authuser/mutations'
import { useRoute } from 'vue-router'

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
  console.log('logging in!')
  await login({ email: userData.email, password: userData.password })
}
</script>
