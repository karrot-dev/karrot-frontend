<template>
  <q-infinite-scroll :handler="loadMore">
    <FeedbackItem
      v-for="feedbackitem in feedback"
      :key="feedbackitem.id"
      :feedback="feedbackitem"
      @join="$emit('join', arguments[0])"
      @leave="$emit('leave', arguments[0])"
    >
      {{ $d(feedbackitem.createdAt, 'dateLongWithDayName') }}
    </FeedbackItem>
    <q-card v-if="empty">
      <q-card-main>
        <q-icon name="fa-bug" />
        {{ $t('HISTORY.NOTHING_HAPPENEND') }}
      </q-card-main>
    </q-card>
    <div
      slot="message"
      style="width: 100%; text-align: center"
    >
      <q-spinner-dots :size="40"/>
    </div>
  </q-infinite-scroll>
</template>

<script>
import FeedbackItem from './FeedbackItem'
import statusMixin from '@/mixins/statusMixin'
import paginationMixin from '@/mixins/paginationMixin'
import { QSpinnerDots, QInfiniteScroll, QIcon, QCard, QCardMain } from 'quasar'

export default {
  mixins: [statusMixin, paginationMixin],
  components: {
    QSpinnerDots, QInfiniteScroll, QIcon, QCard, QCardMain, FeedbackItem,
  },
  props: {
    feedback: { required: true, type: Array },
  },
  computed: {
    empty () {
      return !this.feedback.length && !this.status.pending && !this.status.hasValidationErrors
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
