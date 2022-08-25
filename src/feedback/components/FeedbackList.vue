<template>
  <div class="k-feedback-list">
    <FeedbackNotice
      v-if="feedbackPossibleCount > 0"
      :feedback-possible-count="feedbackPossibleCount"
    />
    <KSpinner v-show="isLoading" />
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
      :disable="!hasNextPage"
      @load="maybeFetchNextPage"
    >
      <FeedbackItem
        v-for="feedbackItem in feedback"
        :key="feedbackItem.id"
        :ref="refFor(feedbackItem.id)"
        :feedback="feedbackItem"
        :class="{ highlight: highlight === feedbackItem.id }"
      >
        {{ $d(feedbackItem.createdAt, 'dateLongWithDayName') }}
      </FeedbackItem>
      <template #loading>
        <KSpinner />
      </template>
    </QInfiniteScroll>
  </div>
</template>

<script>
import { QInfiniteScroll, QIcon } from 'quasar'
import { toRefs } from 'vue'

import FeedbackNotice from '@/group/components/FeedbackNotice'
import KNotice from '@/utils/components/KNotice'
import KSpinner from '@/utils/components/KSpinner'

import FeedbackItem from './FeedbackItem'

export default {
  components: {
    QInfiniteScroll,
    QIcon,
    FeedbackItem,
    KNotice,
    FeedbackNotice,
    KSpinner,
  },
  props: {
    feedback: {
      type: Array,
      required: true,
    },
    feedbackPossibleCount: {
      type: Number,
      default: 0,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    hasNextPage: {
      type: Boolean,
      default: false,
    },
    fetchNextPage: {
      type: Function,
      default: () => {},
    },
    isFetchingNextPage: {
      type: Boolean,
      default: false,
    },
    highlight: {
      default: null,
      type: Number,
    },
  },
  setup (props) {
    const {
      hasNextPage,
      fetchNextPage,
      isFetchingNextPage,
    } = toRefs(props)
    async function maybeFetchNextPage (index, done) {
      if (!isFetchingNextPage.value && hasNextPage.value) await fetchNextPage.value()
      done(!hasNextPage.value)
    }
    return {
      maybeFetchNextPage,
    }
  },
  computed: {
    empty () {
      return !this.isLoading && this.feedback.length < 1
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

<style scoped lang="sass">
@use 'sass:color'

.k-feedback-list
  max-width: 600px
  margin-right: auto
  margin-left: auto

.highlight
  border-color: $secondary

  /* Override !important of no-shadow class */
  box-shadow: color.change($secondary, $alpha: 0.3) 0px 0px 0px 3px !important
</style>
