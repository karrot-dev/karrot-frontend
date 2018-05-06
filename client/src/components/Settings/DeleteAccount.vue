<template>
  <div>
    <q-spinner v-if="isPending" />
    <p v-if="success">
      {{ $t('DELETEACCOUNT.SUCCESS') }}
    </p>
    <div
      v-if="hasError('code')"
      class="error"
    >
      <i class="fas fa-exclamation-triangle"/>
      {{ $t('GLOBAL.INVALID_LINK') }}
    </div>
    <div
      v-if="hasNonFieldError"
      class="error"
    >
      <i class="fas fa-exclamation-triangle"/>
      {{ firstNonFieldError }}
    </div>
    <router-link to="/">
      <q-btn
        v-t="'NOT_FOUND.HOME'"
        icon-right="fa-home"
        color="secondary"
        push
      />
    </router-link>
  </div>
</template>

<script>
import { QSpinner, QBtn } from 'quasar'
import statusMixin from '@/mixins/statusMixin'

export default {
  components: { QSpinner, QBtn },
  mixins: [statusMixin],
  props: {
    success: { required: true, type: Boolean },
  },
}
</script>

<style scoped lang="stylus">
</style>
