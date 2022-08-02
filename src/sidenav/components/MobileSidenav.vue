<template>
  <MobileSidenavUI
    :current-user-id="userId"
    @logout="() => logout()"
    @toggle-sidenav="$emit('toggle-sidenav')"
  />
</template>

<script setup>
import MobileSidenavUI from './MobileSidenavUI'
import { useLogoutMutation } from '@/authuser/mutations'
import { useAuthService } from '@/authuser/services'

defineEmits(['toggle-sidenav'])

const { userId } = useAuthService()
const { mutate: logout } = useLogoutMutation()
</script>
