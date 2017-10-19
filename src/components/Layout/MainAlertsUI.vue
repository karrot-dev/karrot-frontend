<template>
  <div>
    <q-alert
      v-for="alert in formattedAlerts" :key="alert.id"
      :class="alertClasses"
      :color="alert.color"
      :icon="alert.icon"
      dismissible
      @dismiss="$emit('dismiss', alert.id)"
      >
      {{ $t(alert.message, alert.context) }}
    </q-alert>
  </div>
</template>

<script>
import { QAlert } from 'quasar'

const alertTypes = {
  inviteAcceptSuccess: {
    color: 'positive',
    icon: 'fa-user-plus',
    message: 'GROUP.INVITATION_ACCEPT_SUCCESS',
  },
  inviteAcceptError: {
    color: 'negative',
    icon: 'fa-user-plus',
    message: 'GROUP.INVITATION_ACCEPT_ERROR',
  },
  groupLeaveSuccess: {
    color: 'positive',
    icon: 'fa-sign-out fa-fw',
    message: 'GROUP.LEAVE_CONFIRMATION',
  },
}

export default {
  components: { QAlert },
  props: {
    alerts: { required: true },
  },
  computed: {
    formattedAlerts () {
      return this.alerts.map(e => {
        return {
          ...alertTypes[e.type],
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

<style scoped lang="stylus">
</style>
