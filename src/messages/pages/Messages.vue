<template>
  <LatestMessages
    class="k-messages"
    as-page
  />
</template>

<script>
import LatestMessages from '@/messages/components/LatestMessages'

export default {
  components: {
    LatestMessages,
  },
}
</script>

<style lang="stylus" scoped>
.k-messages
  max-width 600px
  width 100%
  margin-left auto
  margin-right auto
</style>
