<template>
  <DeleteAccount
    :status="status"
    :success="isSuccess"
  />
</template>

<script setup>
import { useRoute } from 'vue-router'

import { useDeleteAccountMutation } from '@/authuser/mutations'

import DeleteAccount from '@/authuser/components/Settings/DeleteAccount'

const route = useRoute()

const {
  mutate: deleteAccount,
  status,
  isSuccess,
} = useDeleteAccountMutation()

if (route.query.code) {
  deleteAccount(route.query.code)
}
</script>
