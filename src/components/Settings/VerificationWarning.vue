<template>
  <q-alert
    v-if="!user.mailVerified"
    color="warning"
    enter="bounceInLeft"
    leave="bounceOutRight"
    appear
    dismissible
  >
    <h6>You are not verified yet.</h6>
    <span v-if="!status.success">Please check your emails or <a @click="resend">resend verification mail</a></span>
    <span v-if="status.success">A verification mail has been sent. Please check your mails</span>
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
