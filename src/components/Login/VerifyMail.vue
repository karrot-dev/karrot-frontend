<template>
  <div>
    <q-spinner v-if="isPending" />
    <p v-if="success">
      {{ $t('VERIFYMAIL.SUCCESS') }}
    </p>
    <p v-if="hasAnyError">
      <i
        class="fas fa-exclamation-triangle"
        style="height:25px; width:25px"/>
      {{ anyFirstError }}
    </p>
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
