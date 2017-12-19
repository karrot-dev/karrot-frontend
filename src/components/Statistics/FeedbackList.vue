<template>
  <div>
    <FeedbackItem
      v-for="feedbackitem in feedback"
      :key="feedbackitem.id"
      :feedback="feedbackitem"
      @join="$emit('join', arguments[0])"
      @leave="$emit('leave', arguments[0])"
    >
      {{ $d(feedbackitem.createdAt, 'dateLongWithDayName') }}
    </FeedbackItem>
  </div>
</template>

<script>
import FeedbackItem from './FeedbackItem'

export default {
  props: {
    feedback: { required: true },
  },
  components: {
    FeedbackItem,
  },
}
</script>

<style scoped lang="stylus">
</style>
