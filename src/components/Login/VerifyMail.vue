<template>
  <div>
    <div>
      <h5>{{ user.email }}</h5>
      <q-spinner v-if="isPending" />
      <p v-if="success">
        {{ $t('VERIFYMAIL.SUCCESS') }}
      </p>
      <p v-if="status.hasValidationErrors">
        <i class="fa fa-exclamation-triangle"/>
        {{ status.firstValidationError }}
      </p>
    </div>
  </div>
</template>

<script>
import { QSpinner } from 'quasar'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QSpinner },
  mixins: [statusMixin],
  props: {
    success: { required: true, type: Boolean },
    user: { required: true, type: Object },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
</style>
