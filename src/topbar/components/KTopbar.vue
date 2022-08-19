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

import { useLogoutMutation } from '@/authuser/mutations'
import { useAuthService } from '@/authuser/services'
import { usePresenceService } from '@/base/services/presence'
import { useCurrentGroupService } from '@/group/services'
import { useGroupInfoService } from '@/groupInfo/services'
import { useConnectivity } from '@/utils/services'

import KTopbarUI from './KTopbarUI'

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
