<template>
  <q-alert color="warning">
    <h6>{{ $t('NOTIFICATIONS.NOT_VERIFIED', { email: user.unverifiedEmail }) }}</h6>
    <i18n v-if="!success" path="NOTIFICATIONS.CHECK_YOUR_MAILS" tag="span">
      <a place="resend" @click="resend" class="underline">{{ $t('NOTIFICATIONS.RESEND_VERIFICATION') }}</a>
    </i18n>
    <span v-else>{{ $t('NOTIFICATIONS.VERIFICATION_EMAIL_SENT') }}</span>
    <p v-if="hasAnyError" class="text-negative">{{ anyFirstError }}</p>
  </q-alert>
</template>

<script>
import { QAlert } from 'quasar'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    QAlert,
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      status: 'users/resendVerificationStatus',
      success: 'users/resendVerificationSuccess',
    }),
    hasAnyError () {
      return this.status.hasValidationErrors
    },
    anyFirstError () {
      return this.status.firstValidationError
    },
  },
  methods: {
    ...mapActions({
      resend: 'users/resendVerification',
    }),
  },
}
</script>

<style scoped lang="stylus">
.underline
  text-decoration underline
</style>
