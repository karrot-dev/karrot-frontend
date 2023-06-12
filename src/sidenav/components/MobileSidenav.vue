<template>
  <MobileSidenavUI
    :current-user-id="userId"
    @logout="() => logout()"
    @toggle-sidenav="$emit('toggle-sidenav')"
  />
</template>

<script setup>
import { useLogoutMutation } from '@/authuser/mutations'
import { useAuthService } from '@/authuser/services'

import MobileSidenavUI from './MobileSidenavUI.vue'

defineEmits(['toggle-sidenav'])

const { userId } = useAuthService()
const { mutate: logout } = useLogoutMutation()
</script>
