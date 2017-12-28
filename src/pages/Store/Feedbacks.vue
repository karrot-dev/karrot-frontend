<template>
  <div>
    <KNotice>
      <template slot="icon">
        <i class="fa fa-alert"/>
      </template>
      Not created yet
      <template slot="desc">
        The FeedbackList still needs feedback from the store
      </template>
    </KNotice>
    <FeedbackList :feedback="[]"/>
  </div>
</template>

<script>
import KNotice from '@/components/General/KNotice'
import FeedbackList from '@/components/Statistics/FeedbackList'

export default {
  components: { KNotice, FeedbackList },
}
</script>

<style scoped lang="stylus">
</style>
