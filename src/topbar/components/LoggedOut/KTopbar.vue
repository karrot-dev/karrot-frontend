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
import { useLogoutMutation } from '@/authuser/mutations'

import KTopbarUI from './KTopbarUI'

const { mutate: logout } = useLogoutMutation()
</script>
