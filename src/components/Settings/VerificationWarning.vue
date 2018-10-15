<template>
  <q-alert
    v-if="user && !hasEmailVerified"
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
  <q-collapsible
    v-else-if="hasFailedEmailDeliveries"
    header-class="bg-warning text-white"
  >
    <template
      slot="header"
    >
      <q-item-side
        color="white"
        icon="fas fa-exclamation-triangle"
      />
      <q-item-main
        :label="failedEmailDeliveryMessage"
      />
    </template>
    <q-list>
      <q-item
        v-for="(event, idx) in failedEmailDeliveries"
        :key="idx"
      >
        <q-item-main
          :label="event.subject"
          :sublabel="`${event.event}: ${event.reason}`"
        />
        <q-item-side
          right
          :stamp="$d(event.createdAt, 'long')"
        />
      </q-item>
    </q-list>
  </q-collapsible>
</template>

<script>
import { QAlert, QList, QItem, QItemMain, QItemSide, QCollapsible } from 'quasar'
import { mapActions, mapGetters } from 'vuex'

export default {
  components: {
    QAlert, QList, QItem, QItemMain, QItemSide, QCollapsible,
  },
  computed: {
    ...mapGetters({
      user: 'auth/user',
      failedEmailDeliveries: 'auth/failedEmailDeliveries',
      status: 'users/resendVerificationCodeStatus',
      success: 'users/resendVerificationCodeSuccess',
    }),
    hasAnyError () {
      return this.status.hasValidationErrors
    },
    anyFirstError () {
      return this.status.firstValidationError
    },
    hasEmailVerified () {
      return this.user && this.user.mailVerified
    },
    hasFailedEmailDeliveries () {
      return this.failedEmailDeliveries.length > 0
    },
    failedEmailDeliveryMessage () {
      const count = this.failedEmailDeliveries.length
      if (count > 0) {
        const countString = count >= 10 ? (count + '+') : count
        return this.$tc('NOTIFICATIONS.EMAIL_NOT_DELIVERED', count, { count: countString })
      }
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
