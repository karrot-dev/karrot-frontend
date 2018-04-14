<template>
  <div>
    <k-alert
      v-for="alert in formattedAlerts"
      :key="alert.id"
      :class="alertClasses"
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

    // TODO: Remove (replace by notifyMixin)
    inviteAcceptSuccess () {
      return {
        color: 'positive',
        icon: 'fa-user-plus',
        message: 'GROUP.INVITATION_ACCEPT_SUCCESS',
      }
    },

    // TODO: Remove (replace by notifyMixin)
    resetPasswordSuccess () {
      return {
        color: 'positive',
        icon: 'fa-check-square',
        message: 'PASSWORD.RESET.SUCCESS',
      }
    },

    // TODO: Remove (replace by notifyMixin)
    changePasswordSuccess () {
      return {
        color: 'positive',
        icon: 'fa-check-square',
        message: 'PASSWORD.CHANGE.SUCCESS',
      }
    },

    // TODO: Remove (replace by notifyMixin)
    inviteAcceptError () {
      return {
        color: 'negative',
        icon: 'fa-user-plus',
        message: 'GROUP.INVITATION_ACCEPT_ERROR',
      }
    },

    // TODO: Remove (replace by notifyMixin)
    groupLeaveSuccess () {
      return {
        color: 'positive',
        icon: 'fa-sign-out fa-fw',
        message: 'GROUP.LEAVE_CONFIRMATION',
      }
    },

    // TODO: Remove (replace by notifyMixin)
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

    alertClasses () {
      return this.$q.platform.is.mobile ? {
        'fixed-top': true,
        'z-alert': true, // TODO: z-alert doesn't exist anymore
        'generic-padding': true,
      } : {}
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
