<template>
  <div>
    <div>
      <h5>{{ user.email }}</h5>
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
