<template>
  <div class="k-feedback-list">
    <FeedbackNotice
      v-if="feedbackPossibleCount > 0"
      :feedback-possible-count="feedbackPossibleCount"
    />
    <KSpinner v-show="isPending" />
    <KNotice v-if="empty">
      <template #icon>
        <i :class="$icon('feedback')" />
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
import { QInfiniteScroll } from 'quasar'
import KNotice from '@/utils/components/KNotice'
import KSpinner from '@/utils/components/KSpinner'
import FeedbackNotice from '@/group/components/FeedbackNotice'
import { useCurrentGroup } from '@/activities/data/useCurrentGroup'
import { useGroupStatus } from '@/activities/data/useStatus'

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
  },

  setup () {
    const { currentGroupId: groupId } = useCurrentGroup()
    const { feedbackPossibleCount } = useGroupStatus({ groupId })
    return {
      feedbackPossibleCount,
    }
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
