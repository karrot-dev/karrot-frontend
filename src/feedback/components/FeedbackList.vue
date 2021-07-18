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
        :ref="refFor(feedbackitem.id)"
        :feedback="feedbackitem"
        :class="{ highlight: highlight === feedbackitem.id }"
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
    highlight: {
      default: null,
      type: Number,
    },
  },
  computed: {
    empty () {
      return !this.isPending && !this.hasAnyErrors && this.feedback.length < 1
    },
    highlighted () {
      if (!this.feedback || this.highlight < 0) return
      return this.feedback.find(i => i.id === this.highlight)
    },
  },
  watch: {
    async highlighted (entry) {
      if (!entry) return

      // wait until element is actually rendered
      await this.$nextTick()
      const ref = this.$refs[this.refFor(entry.id)][0]
      ref.$el.scrollIntoView()
    },
  },
  methods: {
    refFor (id) {
      return `feedback-${id}`
    },
  },
}
</script>

<style scoped lang="stylus">
.k-feedback-list
  max-width 600px
  margin-right auto
  margin-left auto

.highlight
  border-color $secondary
  /* Override !important of no-shadow class */
  box-shadow alpha($secondary, 0.3) 0px 0px 0px 3px !important
</style>
