<template>
  <div>
    <k-alert
      v-for="alert in formattedAlerts" :key="alert.id"
      :class="alertClasses"
      :color="alert.color"
      :icon="alert.icon"
      :dismissible="isDismissible(alert)"
      @dismiss="isDismissible(alert) && $emit('dismiss', alert.id)"
      :actions="alert.actions || []">
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
    alerts: { required: true },
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
                buttons: [
                  this.$t('BUTTON.CANCEL'),
                  {
                    label: this.$t('BUTTON.AGREE'),
                    handler: () => {
                      this.$emit('agree', agreement.id)
                    },
                  },
                ],
              })
            },
          },
        ],
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
      })
    },
    alertClasses () {
      return this.$q.platform.is.mobile ? {
        'fixed-top': true,
        'z-alert': true,
        'generic-padding': true,
      } : {}
    },
  },
}
</script>
