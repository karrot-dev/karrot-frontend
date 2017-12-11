<template>
  <q-alert color="warning">
    <h6>{{ $t('NOTIFICATIONS.NOT_VERIFIED', { email: user.unverifiedEmail }) }}</h6>
    <i18n v-if="!success" path="NOTIFICATIONS.CHECK_YOUR_MAILS" tag="span">
      <a place="resend" @click="resend" class="underline">{{ $t('NOTIFICATIONS.RESEND_VERIFICATION') }}</a>
    </i18n>
    <span v-else>{{ $t('NOTIFICATIONS.VERIFICATION_EMAIL_SENT') }}</span>
    <p v-if="hasAnyError" class="text-negative">{{ anyError }}</p>
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
      return !!this.anyError
    },
    anyError () {
      for (let value in Object.values(this.status.validationErrors)) {
        return value[0]
      }
    },
  },
  methods: {
    ...mapActions({
      resend: 'users/resendVerification',
    }),
  },
}
</script>

<style lang="stylus" scoped>
.underline
  text-decoration underline
</style>
