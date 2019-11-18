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
  width 100%
  max-width 600px
  margin-right auto;
  margin-left auto
</style>
