<template>
  <VerifyMail
    :status="status"
    :success="isSuccess"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'

import VerifyMail from '@/authuser/components/VerifyMail'
import { useVerifyEmailMutation } from '@/authuser/mutations'

const route = useRoute()

const {
  mutate: verify,
  status,
  isSuccess,
} = useVerifyEmailMutation()

if (route.query.code) {
  verify(route.query.code)
}
</script>
