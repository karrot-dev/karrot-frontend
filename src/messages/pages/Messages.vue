<template>
  <LatestMessages
    class="k-messages"
    :as-page="!$q.platform.is.mobile"
  />
</template>

<script>
import LatestMessages from '@/components/Conversation/LatestMessages'

export default {
  components: {
    LatestMessages,
  },
}
</script>

<style lang="stylus" scoped>
.k-messages
  max-width 600px
  margin-left auto
  margin-right auto
</style>
