<template>
  <q-infinite-scroll :handler="maybeFetchPast">
    <FeedbackNotice
      v-if="feedbackPossible.length > 0"
      :feedback-possible="feedbackPossible"
    />
    <FeedbackItem
      v-for="feedbackitem in feedback"
      :key="feedbackitem.id"
      :feedback="feedbackitem"
    >
      {{ $d(feedbackitem.createdAt, 'dateLongWithDayName') }}
    </FeedbackItem>

    <KNotice v-if="empty" >
      <template slot="icon">
        <i class="fas fa-balance-scale"/>
      </template>
      {{ $t('FEEDBACKLIST.NONE') }}
      <template slot="desc">
        {{ $t('FEEDBACKLIST.NONE_HINT') }}
      </template>
    </KNotice>
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
import { QSpinnerDots, QInfiniteScroll } from 'quasar'
import KNotice from '@/components/General/KNotice'
import FeedbackNotice from '@/components/Wall/FeedbackNotice'

export default {
  mixins: [statusMixin, paginationMixin],
  components: {
    QSpinnerDots, QInfiniteScroll, FeedbackItem, KNotice, FeedbackNotice,
  },
  props: {
    feedback: { required: true, type: Array },
    feedbackPossible: { default: () => [], type: Array },
  },
  computed: {
    empty () {
      return !this.isPending && !this.hasAnyErrors && this.feedback.length < 1
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
