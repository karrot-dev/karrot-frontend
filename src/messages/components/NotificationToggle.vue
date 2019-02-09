<template>
  <QBtn
    v-if="user && !user.mailVerified"
    round
    :dense="inToolbar"
    :flat="inToolbar"
    :color="inToolbar ? 'white' : 'negative'"
    :to="{ name: 'settings', hash: '#change-email' }"
    :size="size"
  >
    <QIcon
      name="fas fa-exclamation-triangle"
    />
    <QTooltip
      v-t="'WALL.VERIFY_EMAIL_FOR_NOTIFICATIONS'"
      :delay="300"
    />
  </QBtn>
  <QBtn
    v-else
    round
    :dense="inToolbar"
    :flat="inToolbar"
    :color="inToolbar ? 'white' : (isEnabled ? 'secondary' : 'negative')"
    @click="$emit('click')"
    :size="size"
  >
    <QIcon
      v-if="isEnabled"
      name="fas fa-bell"
    />
    <QIcon
      v-else
      name="fas fa-bell-slash"
    />
    <QTooltip
      v-t="isEnabled ? 'WALL.DISABLE_NOTIFICATION_EMAILS' : 'WALL.ENABLE_NOTIFICATION_EMAILS'"
      :delay="300"
    />
  </QBtn>
</template>

<script>
import { QBtn, QIcon, QTooltip } from 'quasar'

export default {
  components: { QBtn, QIcon, QTooltip },
  props: {
    value: {
      type: Boolean,
      default: false,
    },
    user: {
      type: Object,
      default: null,
    },
    inToolbar: {
      type: Boolean,
      default: false,
    },
    size: {
      type: String,
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
