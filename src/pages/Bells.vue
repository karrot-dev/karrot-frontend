<template>
  <Bells
    class="k-bells"
    :as-page="!$q.platform.is.mobile"
  />
</template>

<script>
import Bells from '@/components/Layout/Bells'

export default {
  components: {
    Bells,
  },
}
</script>

<style lang="stylus" scoped>
.k-bells
  max-width 600px
  margin-left auto
  margin-right auto
</style>
