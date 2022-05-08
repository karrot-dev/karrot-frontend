<template>
  <GroupPreviewUI
    :group="$store.getters['groups/activePreview']"
    :is-logged-in="$store.getters['auth/isLoggedIn']"
    :user="$store.getters['auth/user']"
    :application="$store.getters['applications/getForActivePreview']"
    @join="data => $store.dispatch('groups/join', data)"
    @withdraw="data => $store.dispatch('applications/withdraw', data)"
    @open-chat="data => $store.dispatch('detail/openForApplication', data)"
    @go-visit="groupId => $router.push({ name: 'group', params: { groupId } }).catch(() => {})"
    @go-settings="$router.push({ name: 'settings', hash: '#change-email' }).catch(() => {})"
    @go-signup="goSignup"
    @go-apply="groupId => router.push({ name: 'applicationForm', params: { groupPreviewId: groupId } }).catch(() => {})"
  />
</template>

<script>
import GroupPreviewUI from '@/groupInfo/components/GroupPreviewUI'

export default {
  components: {
    GroupPreviewUI,
  },
  methods: {
    goSignup (group) {
      if (group.isOpen) this.$store.dispatch('auth/setJoinGroupAfterLogin', group.id)
      this.$router.push({ name: 'signup' }).catch(() => {})
    },
  },
}
</script>
