<template>
  <q-card>
    <q-card-title v-if="showTitle">
      {{ $t('GROUP.HISTORY') }}
    </q-card-title>
    <q-card-main>
      <q-infinite-scroll :handler="loadMore">
        <table class="q-table highlight striped-odd">
          <tbody>
            <HistoryEntry
              v-for="entry in history"
              :entry="entry"
              :key="entry.id"
            />
          </tbody>
        </table>
        <div v-if="empty">
          <q-icon name="fa-bug" />
            {{ $t('HISTORY.NOTHING_HAPPENEND') }}
          </div>
        <q-spinner-dots
          v-if="this.status.pending"
          :size="40"
        />
        <div
          slot="message"
          style="width: 100%; text-align: center"
        >
          <q-spinner-dots :size="40"/>
        </div>
      </q-infinite-scroll>
    </q-card-main>
  </q-card>
</template>

<script>
import { QIcon, QInfiniteScroll, QSpinnerDots, QCardMain, QCard, QCardTitle } from 'quasar'
import HistoryEntry from '@/components/History/HistoryEntry'

export default {
  props: {
    history: { required: true, type: Array },
    status: { required: true, type: Object },
    canLoadMore: { required: true, type: Boolean },
    fetchMore: { required: true, type: Function },
    showTitle: { default: false, type: Boolean },
  },
  components: { QIcon, QInfiniteScroll, QSpinnerDots, QCardMain, QCard, QCardTitle, HistoryEntry },
  computed: {
    empty () {
      return !this.history.length && !this.status.pending && !this.status.hasValidationErrors
    },
  },
  methods: {
    loadMore (index, done) {
      if (!this.canLoadMore) {
        done()
        return
      }
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
