<template>
  <KTopbarUI
    :breadcrumbs="$store.getters['breadcrumbs/all']"
    :current-user-id="$store.getters['auth/userId']"
    @logout="() => logout()"
  >
    <slot />
  </KTopbarUI>
</template>

<script setup>
import KTopbarUI from './KTopbarUI'
import { useLogoutMutation } from '@/authuser/mutations'

const { mutate: logout } = useLogoutMutation()
</script>
