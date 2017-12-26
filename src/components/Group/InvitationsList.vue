<template>
  <div>
    <q-spinner-dots
      v-if="isPending"
      size="40"
    />
    <template v-else>
      <h5
        class="text-primary generic-padding"
        v-if="invitations.length > 0"
      >
        {{ $t('GROUP.INVITED_LIST') }}
      </h5>
      <ul>
        <li
          v-for="invite in invitations"
          :key="invite.id"
        >
          {{ invite.email }}
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
    invitations: { required: true },
  },
}
</script>

<style scoped lang="stylus">
</style>
