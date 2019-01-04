<template>
  <QInfiniteScroll
    ref="infiniteScroll"
    :handler="maybeFetchPast"
  >
    <HistoryEntry
      v-for="entry in history"
      :entry="entry"
      :key="entry.id"
    />
    <div v-if="empty">
      <QIcon name="fas fa-bug" />
      {{ $t('HISTORY.NOTHING_HAPPENEND') }}
    </div>
    <div
      slot="message"
      style="width: 100%; text-align: center"
    >
      <QSpinnerDots :size="40"/>
    </div>
  </QInfiniteScroll>
</template>

<script>
import { QIcon, QInfiniteScroll, QSpinnerDots, QList } from 'quasar'
import paginationMixin from '@/utils/mixins/paginationMixin'
import HistoryEntry from '@/history/components/HistoryEntry'

export default {
  mixins: [paginationMixin],
  props: {
    history: { required: true, type: Array },
    status: { default: null, type: Object },
  },
  components: { QIcon, QInfiniteScroll, QSpinnerDots, QList, HistoryEntry },
  computed: {
    empty () {
      return !this.history.length && !this.status.pending && !this.status.hasValidationErrors
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
