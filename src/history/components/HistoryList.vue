<template>
  <QInfiniteScroll
    ref="infiniteScroll"
    :disable="!canFetchPast"
    @load="maybeFetchPast"
  >
    <KSpinner v-show="pending" />
    <HistoryEntry
      v-for="entry in history"
      :key="entry.id"
      :entry="entry"
    />
    <div v-if="empty">
      <QIcon name="fas fa-bug" />
      {{ $t('HISTORY.NOTHING_HAPPENEND') }}
    </div>
    <template #loading>
      <KSpinner />
    </template>
  </QInfiniteScroll>
</template>

<script>
import {
  QIcon,
  QInfiniteScroll,
} from 'quasar'

import paginationMixin from '@/utils/mixins/paginationMixin'

import HistoryEntry from '@/history/components/HistoryEntry'
import KSpinner from '@/utils/components/KSpinner'

export default {
  components: {
    QIcon,
    QInfiniteScroll,
    HistoryEntry,
    KSpinner,
  },
  mixins: [paginationMixin],
  props: {
    history: { required: true, type: Array },
    pending: { default: false, type: Boolean },
  },
  computed: {
    empty () {
      return !this.history.length && !this.pending
    },
  },
}
</script>

<style scoped lang="sass">
</style>
