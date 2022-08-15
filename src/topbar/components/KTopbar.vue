<template>
  <KTopbarUI
    :current-group="currentGroup"
    :my-groups="myGroups"
    :user="user"
    :away="$store.getters['presence/toggle/away']"
    :connected="$store.getters['connectivity/connected']"
    :reconnecting="$store.getters['connectivity/reconnecting']"
    @logout="() => logout()"
    @reconnect="$store.dispatch('connectivity/reconnect')"
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

defineEmits(['toggle-sidenav'])

const {
  user,
} = useAuthService()

const {
  group: currentGroup,
} = useCurrentGroupService()

const { groups } = useGroupInfoService()

const myGroups = computed(() => groups.value.filter(group => group.isMember))

const { mutate: logout } = useLogoutMutation()
</script>
