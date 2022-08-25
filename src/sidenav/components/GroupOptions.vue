<template>
  <GroupOptionsUI
    :current-group-id="group?.id"
    :roles="roles"
  />
</template>

<script setup>
import { computed } from 'vue'

import { useAuthService } from '@/authuser/services'
import { useCurrentGroupService } from '@/group/services'

import GroupOptionsUI from './GroupOptionsUI'

const { group, getUserRoles } = useCurrentGroupService()
const { userId } = useAuthService()

const roles = computed(() => getUserRoles(userId.value))
</script>
