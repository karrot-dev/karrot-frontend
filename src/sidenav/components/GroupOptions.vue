<template>
  <GroupOptionsUI
    :current-group-id="group?.id"
    :roles="roles"
  />
</template>

<script setup>
import { useCurrentGroupService } from '@/group/services'

import GroupOptionsUI from './GroupOptionsUI.vue'

const { group, roles } = useCurrentGroupService()
</script>
