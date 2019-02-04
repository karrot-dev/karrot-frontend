<template>
  <div class="k-feedback-list">
    <FeedbackNotice
      v-if="feedbackPossible.length > 0"
      :feedback-possible="feedbackPossible"
    />
    <div
      v-if="isPending"
      style="width: 100%; text-align: center"
    >
      <QSpinnerDots :size="40"/>
    </div>
    <KNotice v-else-if="empty" >
      <template slot="icon">
        <i class="fas fa-balance-scale"/>
      </template>
      {{ $t('FEEDBACKLIST.NONE') }}
      <template slot="desc">
        {{ $t('FEEDBACKLIST.NONE_HINT') }}
      </template>
    </KNotice>
    <QInfiniteScroll
      v-else
      :handler="maybeFetchPast"
    >
      <FeedbackItem
        v-for="feedbackitem in feedback"
        :key="feedbackitem.id"
        :feedback="feedbackitem"
      >
        {{ $d(feedbackitem.createdAt, 'dateLongWithDayName') }}
      </FeedbackItem>
      <div
        slot="message"
        style="width: 100%; text-align: center"
      >
        <QSpinnerDots :size="40"/>
      </div>
    </QInfiniteScroll>
  </div>
</template>

<script>
import FeedbackItem from './FeedbackItem'
import statusMixin from '@/utils/mixins/statusMixin'
import paginationMixin from '@/utils/mixins/paginationMixin'
import { QSpinnerDots, QInfiniteScroll } from 'quasar'
import KNotice from '@/utils/components/KNotice'
import FeedbackNotice from '@/group/components/FeedbackNotice'

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
.k-feedback-list
  max-width 600px
  margin-left auto
  margin-right auto
</style>
