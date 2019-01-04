<template>
  <div>
    <QSpinner v-if="isPending" />
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
    <RouterLink to="/">
      <QBtn
        v-t="'NOT_FOUND.HOME'"
        icon-right="fas fa-home"
        color="secondary"
        push
      />
    </RouterLink>
  </div>
</template>

<script>
import { QSpinner, QBtn } from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'

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
