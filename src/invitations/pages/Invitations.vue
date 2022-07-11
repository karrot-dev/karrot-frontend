<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

=======
<template>
  <InvitationsUI
    :invitations="$store.getters['invitations/byCurrentGroup']"
    :fetch-status="$store.getters['invitations/fetchStatus']"
    :send-status="$store.getters['invitations/sendStatus']"
    @submit="data => $store.dispatch('invitations/send', data)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import InvitationsUI from '@/invitations/components/InvitationsUI'

export default {
  components: {
    InvitationsUI,
  },
}
</script>
