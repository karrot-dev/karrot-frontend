<template>
  <Notifications
    class="k-notifications"
    :as-page="!$q.platform.is.mobile"
  />
</template>

<script>
import Notifications from '@/notifications/components/Notifications'

import { useMarkSeenMutation } from '../mutations'

export default {
  components: {
    Notifications,
  },
  setup () {
    const { mutate: markSeen } = useMarkSeenMutation()

    return { markSeen }
  },
  mounted () {
    this.markSeen()
  },
}
</script>

<style lang="sass" scoped>
.k-notifications
  width: 100%
  max-width: 600px
  margin-right: auto
  margin-left: auto
</style>
