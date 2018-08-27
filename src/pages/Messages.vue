<template>
  <LatestMessages :as-page="!$q.platform.is.mobile" />
</template>

<script>
import LatestMessages from '@/components/Conversation/LatestMessages'

export default {
  components: {
    LatestMessages,
  },
}
</script>
