<template>
  <div class="k-feedback-list">
    <FeedbackNotice
      v-if="feedbackPossible.length > 0"
      :feedback-possible="feedbackPossible"
    />
    <KSpinner v-show="isPending || (feedbackPossibleStatus && feedbackPossibleStatus.pending)" />
    <KNotice v-if="empty">
      <template #icon>
        <QIcon :class="$icon('feedback')" />
      </template>
      {{ $t('FEEDBACKLIST.NONE') }}
      <template #desc>
        {{ $t('FEEDBACKLIST.NONE_HINT') }}
      </template>
    </KNotice>
    <QInfiniteScroll
      v-else
      :disable="!canFetchPast"
      @load="maybeFetchPast"
    >
      <FeedbackItem
        v-for="feedbackitem in feedback"
        :key="feedbackitem.id"
        :feedback="feedbackitem"
      >
        {{ $d(feedbackitem.createdAt, 'dateLongWithDayName') }}
      </FeedbackItem>
      <template #loading>
        <KSpinner />
      </template>
    </QInfiniteScroll>
  </div>
</template>

<script>
import FeedbackItem from './FeedbackItem'
import statusMixin from '@/utils/mixins/statusMixin'
import paginationMixin from '@/utils/mixins/paginationMixin'
import { QInfiniteScroll, QIcon } from 'quasar'
import KNotice from '@/utils/components/KNotice'
import KSpinner from '@/utils/components/KSpinner'
import FeedbackNotice from '@/group/components/FeedbackNotice'

export default {
  components: {
    QInfiniteScroll,
    QIcon,
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
  margin-right auto
  margin-left auto
</style>
