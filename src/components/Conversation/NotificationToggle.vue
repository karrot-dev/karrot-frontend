<template>
  <q-btn
    v-if="user && !user.mailVerified"
    round
    color="negative"
    :to="{ name: 'settings', hash: '#change-email' }"
  >
    <q-icon
      name="fas fa-exclamation-triangle"
    />
    <q-tooltip
      v-t="'WALL.VERIFY_EMAIL_FOR_NOTIFICATIONS'"
      :delay="1000"
    />
  </q-btn>
  <q-btn
    v-else
    round
    :color="isEnabled ? 'secondary' : 'negative'"
    @click="$emit('click')"
  >
    <q-icon
      v-if="isEnabled"
      name="fas fa-bell"
    />
    <q-icon
      v-else
      name="fas fa-bell-slash"
    />
    <q-tooltip
      v-t="isEnabled ? 'WALL.DISABLE_NOTIFICATION_EMAILS' : 'WALL.ENABLE_NOTIFICATION_EMAILS'"
      :delay="1000"
    />
  </q-btn>
</template>

<script>
import { QBtn, QIcon, QTooltip } from 'quasar'

export default {
  name: 'Conversation',
  components: { QBtn, QIcon, QTooltip },
  props: {
    value: {
      type: Boolean,
      required: true,
    },
    user: {
      type: Object,
      default: null,
    },
  },
  computed: {
    isEnabled () {
      return this.value === true
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
