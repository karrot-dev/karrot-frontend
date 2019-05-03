<template>
  <QAlert
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
        class="underline"
        @click="resend"
      >
        {{ $t('NOTIFICATIONS.RESEND_VERIFICATION') }}
      </a>
    </i18n>
    <p v-else>
      {{ $t('NOTIFICATIONS.VERIFICATION_EMAIL_SENT') }}
    </p>
    <p
      v-if="hasAnyError"
      class="bg-white text-negative"
    >
      <i class="fas fa-exclamation-triangle" />
      {{ anyFirstError }}
    </p>
  </QAlert>
  <QCollapsible
    v-else-if="hasFailedEmailDeliveries"
    header-class="bg-warning text-white"
  >
    <template
      slot="header"
    >
      <QItemSide
        color="white"
        icon="fas fa-exclamation-triangle"
      />
      <QItemMain
        :label="failedEmailDeliveryMessage"
      />
    </template>
    <QList>
      <QItem
        v-for="(event, idx) in failedEmailDeliveries"
        :key="idx"
      >
        <QItemMain
          :label="event.subject"
          :sublabel="`${event.event}: ${event.reason}`"
        />
        <QItemSide
          right
          :stamp="$d(event.createdAt, 'long')"
        />
      </QItem>
    </QList>
  </QCollapsible>
</template>

<script>
import { QAlert, QList, QItem, QItemMain, QItemSide, QCollapsible } from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import statusMixin from '@/utils/mixins/statusMixin'

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
    ...statusMixin.computed,
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
      return null
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
