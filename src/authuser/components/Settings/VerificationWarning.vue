<template>
  <div>
    <QBanner
      v-if="user && !hasEmailVerified"
      class="q-ma-sm bg-warning text-white shadow-2"
      style="min-height: unset"
    >
      <template #avatar>
        <QIcon
          name="fas fa-exclamation-triangle"
          color="white"
          style="font-size: 24px"
        />
      </template>
      <p>{{ $t('NOTIFICATIONS.NOT_VERIFIED', { email: user.unverifiedEmail }) }}</p>
      <p>{{ $t('WALL.VERIFY_EMAIL_FOR_NOTIFICATIONS') }}</p>
      <i18n
        v-if="!success"
        path="NOTIFICATIONS.CHECK_YOUR_MAILS"
        tag="span"
      >
        <a
          slot="resend"
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
    </QBanner>
    <QExpansionItem
      v-if="hasFailedEmailDeliveries"
      class="q-ma-sm shadow-2"
      header-class="bg-warning"
      dark
    >
      <template #header>
        <QItemSection
          side
          class="text-white"
        >
          <QIcon name="fas fa-exclamation-triangle" />
        </QItemSection>
        <QItemSection>
          {{ failedEmailDeliveryMessage }}
        </QItemSection>
      </template>
      <QList bordered>
        <QItem
          v-for="(event, idx) in failedEmailDeliveries"
          :key="idx"
        >
          <QItemSection>
            <QItemLabel>
              {{ event.subject }}
            </QItemLabel>
            <QItemLabel caption>
              {{ `${event.event}: ${event.reason}` }}
            </QItemLabel>
          </QItemSection>
          <QItemSection
            side
          >
            {{ $d(event.createdAt, 'long') }}
          </QItemSection>
        </QItem>
      </QList>
    </QExpansionItem>
  </div>
</template>

<script>
import {
  QBanner,
  QList,
  QItem,
  QItemSection,
  QItemLabel,
  QExpansionItem,
  QIcon,
} from 'quasar'
import { mapActions, mapGetters } from 'vuex'
import statusMixin from '@/utils/mixins/statusMixin'

export default {
  components: {
    QBanner,
    QList,
    QItem,
    QItemSection,
    QItemLabel,
    QExpansionItem,
    QIcon,
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

>>> .q-banner__avatar
  align-self center
</style>
