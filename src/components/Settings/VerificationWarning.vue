<template>
  <q-alert
    icon="fas fa-exclamation-triangle"
    color="warning"
  >
    <p>{{ $t('NOTIFICATIONS.NOT_VERIFIED', { email: user.unverifiedEmail }) }}</p>
    <p>{{ $t('WALL.VERIFY_EMAIL_FOR_NOTIFICATIONS') }}</p>
    <i18n
      v-if="!success"
      path="NOTIFICATIONS.CHECK_YOUR_MAILS"
      tag="span"
    >
      <a
        place="resend"
        @click="resend"
        class="underline"
      >
        {{ $t('NOTIFICATIONS.RESEND_VERIFICATION') }}
      </a>
    </i18n>
    <span v-else>
      {{ $t('NOTIFICATIONS.VERIFICATION_EMAIL_SENT') }}
    </span>
    <p
      v-if="hasAnyError"
      class="text-negative"
    >
      {{ anyFirstError }}
    </p>
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
      status: 'users/resendVerificationCodeStatus',
      success: 'users/resendVerificationCodeSuccess',
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
      resend: 'users/resendVerificationCode',
    }),
  },
}
</script>

<style scoped lang="stylus">
.underline
  text-decoration underline
  cursor pointer
</style>
