<template>
  <KTopbarUI
    :current-group="currentGroup"
    :my-groups="myGroups"
    :user="user"
    :away="isAway"
    :connected="isConnected"
    :reconnecting="isReconnecting"
    @logout="() => logout()"
    @reconnect="requestReconnect"
    @toggle-sidenav="$emit('toggle-sidenav')"
  >
    <slot />
  </KTopbarUI>
</template>

<script setup>
import { computed } from 'vue'

import KTopbarUI from './KTopbarUI'
import { useLogoutMutation } from '@/authuser/mutations'
import { useCurrentGroupService } from '@/group/services'
import { useAuthService } from '@/authuser/services'
import { useGroupInfoService } from '@/groupInfo/services'
import { useConnectivity } from '@/utils/services'
import { usePresenceService } from '@/base/services/presence'

defineEmits(['toggle-sidenav'])

const { isAway } = usePresenceService()

const {
  user,
} = useAuthService()

const {
  group: currentGroup,
} = useCurrentGroupService()

const {
  isConnected,
  isReconnecting,
  requestReconnect,
} = useConnectivity()

const { groups } = useGroupInfoService()

const myGroups = computed(() => groups.value.filter(group => group.isMember))

const { mutate: logout } = useLogoutMutation()
</script>
