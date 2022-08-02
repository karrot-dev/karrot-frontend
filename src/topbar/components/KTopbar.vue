<template>
  <KTopbarUI
    :current-group="$store.getters['currentGroup/value']"
    :my-groups="$store.getters['groups/mine']"
    :breadcrumbs="$store.getters['breadcrumbs/all']"
    :user="$store.getters['auth/user']"
    :search-open="$store.getters['search/open']"
    :away="$store.getters['presence/toggle/away']"
    :connected="$store.getters['connectivity/connected']"
    :reconnecting="$store.getters['connectivity/reconnecting']"
    @logout="() => logout()"
    @reconnect="$store.dispatch('connectivity/reconnect')"
    @show-search="$store.commit('search/show')"
    @hide-search="$store.commit('search/hide')"
    @toggle-sidenav="$emit('toggle-sidenav')"
  >
    <slot />
  </KTopbarUI>
</template>

<script setup>
import KTopbarUI from './KTopbarUI'
import { useLogoutMutation } from '@/authuser/mutations'

defineEmits(['toggle-sidenav'])

const { mutate: logout } = useLogoutMutation()
</script>
