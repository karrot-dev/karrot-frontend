<template>
  <div>
    <div>
      <h4>{{ $t('VERIFYMAIL.TITLE') }}</h4>
      <h5>{{ user.email }}</h5>
    </div>
    <div>
      <q-spinner v-if="status.isWaiting" />
      <p v-if="status.success">
        {{ $t('VERIFYMAIL.SUCCESS') }}
      </p>
      <p v-if="status.error">
        {{ $t('VERIFYMAIL.ERROR') }}
        {{ status.error.data }}
      </p>
    </div>
  </div>
</template>

<script>
import { QSpinner } from 'quasar'

export default {
  components: { QSpinner },
  props: {
    status: { required: true },
    user: { required: true },
  },
}
</script>

<style scoped lang="stylus">
@import '~variables'
</style>
