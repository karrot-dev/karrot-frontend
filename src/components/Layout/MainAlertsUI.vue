<template>
  <div>
    <k-alert
      v-for="alert in formattedAlerts"
      :key="alert.id"
      :class="{ 'fixed-bottom': true, 'z-alert': true, 'generic-padding': true, }"
      :color="alert.color"
      :icon="alert.icon"
      :position="alert.position"
      :dismissible="isDismissible(alert)"
      @dismiss="isDismissible(alert) && $emit('dismiss', alert.id)"
      :actions="alert.actions || []"
    >
      {{ $t(alert.message, alert.context) }}
    </k-alert>
  </div>
</template>

<script>
import { Dialog } from 'quasar'
import KAlert from '@/components/Layout/KAlert'

export default {
  components: { KAlert },
  props: {
    alerts: {
      type: Array,
      required: true,
    },
  },
  methods: {

    isDismissible ({ id, dismissible }) {
      return id && !dismissible
    },

    inviteAcceptSuccess () {
      return {
        color: 'positive',
        icon: 'fa-user-plus',
        message: 'GROUP.INVITATION_ACCEPT_SUCCESS',
      }
    },

    resetPasswordSuccess () {
      return {
        color: 'positive',
        icon: 'fa-check-square',
        message: 'PASSWORD.RESET.SUCCESS',
      }
    },

    changePasswordSuccess () {
      return {
        color: 'positive',
        icon: 'fa-check-square',
        message: 'PASSWORD.CHANGE.SUCCESS',
      }
    },

    inviteAcceptError () {
      return {
        color: 'negative',
        icon: 'fa-user-plus',
        message: 'GROUP.INVITATION_ACCEPT_ERROR',
      }
    },

    groupLeaveSuccess () {
      return {
        color: 'positive',
        icon: 'fa-sign-out fa-fw',
        message: 'GROUP.LEAVE_CONFIRMATION',
      }
    },

    requestDeleteAccountSuccess () {
      return {
        color: 'positive',
        icon: 'fa-check-square',
        message: 'USERDATA.REQUEST_DELETE_ACCOUNT.SUCCESS',
      }
    },

    awaitingAgreement (agreement) {
      return {
        color: 'negative',
        icon: 'pan_tool',
        message: 'AGREEMENT.AGREE',
        actions: [
          {
            label: this.$t('AGREEMENT.VIEW'),
            handler: () => {
              Dialog.create({
                title: agreement.title,
                message: agreement.content,
                cancel: this.$t('BUTTON.CANCEL'),
                ok: this.$t('BUTTON.AGREE'),
              })
                .then(() => this.$emit('agree', agreement.id))
                .catch(() => {})
            },
          },
        ],
      }
    },

    playgroundGroupInfo () {
      return {
        color: 'positive',
        icon: 'fa-child',
        message: 'GROUP.PLAYGROUND_INFO',
      }
    },

  },
  computed: {
    formattedAlerts () {
      return this.alerts.map(e => {
        return {
          ...this[e.type](e.context),
          ...e,
        }
      }).filter(e => {
        if (e.desktopOnly && this.$q.platform.is.mobile) return false
        return true
      })
    },
  },
}
</script>
