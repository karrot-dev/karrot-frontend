<template>
  <Notifications
    class="k-notifications"
    :as-page="!$q.platform.is.mobile"
  />
</template>

<script>
import Notifications from '@/components/Layout/Notifications'

export default {
  components: {
    Notifications,
  },
}
</script>

<style lang="stylus" scoped>
.k-notifications
  max-width 600px
  margin-left auto
  margin-right auto
</style>
