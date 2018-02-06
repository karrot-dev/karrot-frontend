<template>
  <div>
    <q-spinner-dots
      v-if="isPending"
      size="40"
    />
    <template v-else>
      <h6
        class="generic-padding"
        v-if="invitations.length > 0"
      >
        {{ $t('GROUP.INVITED_LIST') }}
      </h6>
      <ul>
        <li
          v-for="invite in invitations"
          :key="invite.id"
        >
          {{ $t('GROUP.INVITATION_LIST_ENTRY', { email: invite.email, inviter: invite.invitedBy.displayName }) }}
        </li>
      </ul>
    </template>
  </div>
</template>

<script>
import { QSpinnerDots } from 'quasar'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QSpinnerDots },
  mixins: [statusMixin],
  props: {
    invitations: {
      type: Array,
      required: true,
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
