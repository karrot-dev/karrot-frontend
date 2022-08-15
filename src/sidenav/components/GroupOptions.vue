<template>
  <GroupOptionsUI
    :current-group-id="group?.id"
    :roles="roles"
    @leave="data => $store.dispatch('groups/leave', data)"
  />
</template>

<script setup>
import { computed } from 'vue'

import GroupOptionsUI from './GroupOptionsUI'
import { useCurrentGroupService } from '@/group/services'
import { useAuthService } from '@/authuser/services'

const { group, getUserRoles } = useCurrentGroupService()
const { userId } = useAuthService()

const roles = computed(() => getUserRoles(userId.value))
</script>
