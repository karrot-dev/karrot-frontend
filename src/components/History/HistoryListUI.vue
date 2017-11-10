<template>
  <q-infinite-scroll :handler="loadMore">
    <table class="q-table highlight" :class="tableClass">
      <tbody>
        <HistoryEntry
          v-for="entry in history"
          :entry="entry"
          :key="entry.id"
        />
      </tbody>
    </table>
    <q-card-main v-if="!history.length && status.success"><q-icon name="fa-bug" />{{ $t('HISTORY.NOTHING_HAPPENEND') }}</q-card-main>
    <div v-if="canLoadMore || status.isWaiting" class="text-center"><q-spinner-dots slot="message" :size="40"></q-spinner-dots></div>
  </q-infinite-scroll>
</template>

<script>
import { QIcon, QInfiniteScroll, QSpinnerDots, QCardMain } from 'quasar'
import HistoryEntry from '@/components/History/HistoryEntry'

export default {
  props: {
    user: { required: false },
    store: { required: false },
    group: { required: false },
    history: { required: true },
    status: { required: true },
    canLoadMore: { required: true },
    fetchMore: { required: true },
    striped: { required: false },
  },
  computed: {
    tableClass () {
      return {
        'striped-odd': !this.striped || this.striped === 'odd',
        'striped-even': this.striped === 'even',
      }
    },
  },
  components: { QIcon, QInfiniteScroll, QSpinnerDots, QCardMain, HistoryEntry },
  methods: {
    loadMore (index, done) {
      if (!this.canLoadMore) return done()
      this.fetchMore().then(done)
    },
  },
}
</script>

<style scoped lang="stylus">
table {
  width: 100%;
}
</style>
