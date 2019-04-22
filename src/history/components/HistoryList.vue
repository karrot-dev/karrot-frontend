<template>
  <QInfiniteScroll
    ref="infiniteScroll"
    :handler="maybeFetchPast"
  >
    <KSpinner v-show="isPending" />
    <HistoryEntry
      v-for="entry in history"
      :key="entry.id"
      :entry="entry"
    />
    <div v-if="empty">
      <QIcon name="fas fa-bug" />
      {{ $t('HISTORY.NOTHING_HAPPENEND') }}
    </div>
    <KSpinner slot="message" />
  </QInfiniteScroll>
</template>

<script>
import {
  QIcon,
  QInfiniteScroll,
} from 'quasar'
import paginationMixin from '@/utils/mixins/paginationMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import HistoryEntry from '@/history/components/HistoryEntry'
import KSpinner from '@/utils/components/KSpinner'

export default {
  components: {
    QIcon,
    QInfiniteScroll,
    HistoryEntry,
    KSpinner,
  },
  mixins: [statusMixin, paginationMixin],
  props: {
    history: { required: true, type: Array },
    status: { default: null, type: Object },
  },
  computed: {
    empty () {
      return !this.history.length && !this.status.pending && !this.status.hasValidationErrors
    },
  },
}
</script>

<style scoped lang="stylus">
</style>
