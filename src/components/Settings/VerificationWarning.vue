<template>
  <q-alert color="warning">
    <h6>{{ $t('NOTIFICATIONS.NOT_VERIFIED', { email: user.unverifiedEmail }) }}</h6>
    <i18n v-if="!status.success" path="NOTIFICATIONS.CHECK_YOUR_MAILS" tag="span">
      <a place="resend" @click="resend" class="underline">{{ $t('NOTIFICATIONS.RESEND_VERIFICATION') }}</a>
    </i18n>
    <span v-if="status.success">{{ $t('NOTIFICATIONS.VERIFICATION_EMAIL_SENT') }}</span>
    <p v-if="status.error">Error: {{status.error}}</p>
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
    }),
  },
  methods: {
    ...mapActions({
      resend: 'users/resendVerificationmail',
    }),
  },
}
</script>

<style lang="stylus" scoped>
.underline
  text-decoration underline
</style>
