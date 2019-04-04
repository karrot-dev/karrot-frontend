<template>
  <QCard
    class="no-mobile-margin no-padding no-shadow grey-border"
  >
    <RandomArt
      :seed="groupid"
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
      :invitations="invitations"
      :status="sendStatus"
      class="q-ma-md"
      @submit="$emit('submit', arguments[0])"
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

import {
  mapGetters,
} from 'vuex'

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
  computed: {
    ...mapGetters({
      groupid: 'currentGroup/id',
    }),
  },
}
</script>
