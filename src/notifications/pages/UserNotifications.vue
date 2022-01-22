<template>
  <UserNotifications
    class="k-notifications"
    :as-page="!$q.platform.is.mobile"
  />
</template>

<script>
import { mapActions } from 'vuex'
import UserNotifications from '@/notifications/components/UserNotifications'

export default {
  components: {
    UserNotifications,
  },
  mounted () {
    this.markSeen()
  },
  methods: {
    ...mapActions({
      markSeen: 'notifications/markSeen',
    }),
  },
}
</script>

<style lang="stylus" scoped>
.k-notifications
  width 100%
  max-width 600px
  margin-right auto
  margin-left auto
</style>
