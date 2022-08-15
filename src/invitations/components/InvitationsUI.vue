<template>
  <QCard
    class="no-mobile-margin no-shadow grey-border"
  >
    <RandomArt
      :seed="groupId"
      type="circles"
    >
      <div class="text-white row no-wrap q-mx-md">
        <h4>
          <i class="fas fa-user-plus" />
          {{ $t('GROUP.INVITE_TITLE') }}
        </h4>
      </div>
    </RandomArt>

    <InvitationsForm
      :status="sendStatus"
      class="q-ma-md"
      @submit="(...args) => $emit('submit', ...args)"
    />
    <InvitationsList
      :invitations="invitations"
      :status="fetchStatus"
      class="q-my-md"
    />
  </QCard>
</template>

<script>
import { QCard } from 'quasar'
import InvitationsForm from './InvitationsForm'
import InvitationsList from './InvitationsList'
import RandomArt from '@/utils/components/RandomArt'

import { useCurrentGroupService } from '@/group/services'

export default {
  components: {
    RandomArt,
    QCard,
    InvitationsForm,
    InvitationsList,
  },
  props: {
    invitations: {
      type: Array,
      required: true,
    },
    fetchStatus: {
      type: Object,
      required: true,
    },
    sendStatus: {
      type: Object,
      required: true,
    },
  },
  emits: [
    'submit',
  ],
  setup () {
    const { groupId } = useCurrentGroupService()
    return { groupId }
  },
}
</script>
