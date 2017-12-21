<template>
  <div class="generic-padding bg-white">
    <h5 class="text-primary generic-padding">
      <q-icon name="fa-user-plus" />
      {{ $t('GROUP.INVITE_TITLE') }}
    </h5>
    <InvitationsForm
      :invitations="invitations"
      :status="sendStatus"
      @submit="$emit('submit', arguments[0])"
    />
    <InvitationsList
      :invitations="invitations"
      :status="fetchStatus"
    />
  </div>
</template>

<script>
import { QIcon } from 'quasar'
import InvitationsForm from './InvitationsForm'
import InvitationsList from './InvitationsList'

export default {
  components: { QIcon, InvitationsForm, InvitationsList },
  props: {
    invitations: { required: true },
    fetchStatus: { required: true },
    sendStatus: { required: true },
  },
}
</script>

<style scoped lang="stylus">
</style>
