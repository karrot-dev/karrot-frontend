<template>
  <InvitationsUI
    :invitations="$store.getters['invitations/byCurrentGroup']"
    :fetch-status="$store.getters['invitations/fetchStatus']"
    :send-status="$store.getters['invitations/sendStatus']"
    @submit="data => $store.dispatch('invitations/send', data)"
  />
</template>

<script>
import InvitationsUI from '@/invitations/components/InvitationsUI'

export default {
  components: {
    InvitationsUI,
  },
}
</script>
