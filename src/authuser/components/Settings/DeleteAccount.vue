<template>
  <div>
    <KSpinner v-show="isPending" />
    <p v-if="success">
      {{ $t('DELETEACCOUNT.SUCCESS') }}
    </p>
    <div
      v-if="hasError('code')"
      class="text-warning"
    >
      <i class="fas fa-exclamation-triangle" />
      {{ $t('GLOBAL.INVALID_LINK') }}
    </div>
    <div
      v-if="hasNonFieldError"
      class="text-warning"
    >
      <i class="fas fa-exclamation-triangle" />
      {{ firstNonFieldError }}
    </div>
    <RouterLink to="/">
      <QBtn
        icon-right="fas fa-home"
        color="secondary"
        push
      >
        <span v-t="'NOT_FOUND.HOME'" />
      </QBtn>
    </RouterLink>
  </div>
</template>

<script>
import { QBtn } from 'quasar'
import statusMixin from '@/utils/mixins/statusMixin'
import KSpinner from '@/utils/components/KSpinner'

export default {
  components: {
    QBtn,
    KSpinner,
  },
  mixins: [statusMixin],
  props: {
    success: { required: true, type: Boolean },
  },
}
</script>
