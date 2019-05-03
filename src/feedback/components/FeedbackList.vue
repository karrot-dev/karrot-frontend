<template>
  <div class="k-feedback-list">
    <FeedbackNotice
      v-if="feedbackPossible.length > 0"
      :feedback-possible="feedbackPossible"
    />
    <KSpinner v-show="isPending || (feedbackPossibleStatus && feedbackPossibleStatus.pending)" />
    <KNotice v-if="empty">
      <template slot="icon">
        <i class="fas fa-balance-scale" />
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
      <KSpinner slot="message" />
    </QInfiniteScroll>
  </div>
</template>

<script>
import FeedbackItem from './FeedbackItem'
import statusMixin from '@/utils/mixins/statusMixin'
import paginationMixin from '@/utils/mixins/paginationMixin'
import { QInfiniteScroll } from 'quasar'
import KNotice from '@/utils/components/KNotice'
import KSpinner from '@/utils/components/KSpinner'
import FeedbackNotice from '@/group/components/FeedbackNotice'

export default {
  components: {
    QInfiniteScroll,
    FeedbackItem,
    KNotice,
    FeedbackNotice,
    KSpinner,
  },
  mixins: [statusMixin, paginationMixin],
  props: {
    feedback: { required: true, type: Array },
    feedbackPossible: { default: () => [], type: Array },
    feedbackPossibleStatus: {
      default: null,
      type: Object,
    },
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
