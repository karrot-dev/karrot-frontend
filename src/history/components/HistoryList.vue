<template>
  <div>
    <div
      v-if="history.length > 0"
      class="row no-wrap items-center justify-between bg-white q-px-sm q-py-xs"
    >
      <div class="row q-gutter-sm">
        <QSelect
          v-model="historyType"
          :options="historyTypeOptions"
          emit-value
          map-options
          outlined
          hide-bottom-space
          dense
        />
        <QSelect
          v-model="userId"
          :options="usersOptions"
          emit-value
          map-options
          outlined
          hide-bottom-space
          dense
        />
        <QInput
          v-model.lazy="before"
          mask="####-##-##T##:##"
          outlined
          hide-bottom-space
          dense
        />
      </div>
      <div class="text-caption q-ml-xs">
        {{ filteredHistory.length }} / {{ history.length }}
      </div>
    </div>
    <QInfiniteScroll
      ref="infiniteScroll"
      :disable="!canFetchPast"
      @load="maybeFetchPast"
    >
      <KSpinner v-show="isPending" />
      <HistoryEntry
        v-for="entry in filteredHistory"
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
  </div>
</template>

<script>
import {
  QIcon,
  QInfiniteScroll,
  QSelect,
  QInput,
  date,
} from 'quasar'
import paginationMixin from '@/utils/mixins/paginationMixin'
import statusMixin from '@/utils/mixins/statusMixin'
import bindRoute from '@/utils/mixins/bindRoute'
import HistoryEntry from '@/history/components/HistoryEntry'
import KSpinner from '@/utils/components/KSpinner'

export default {
  components: {
    QIcon,
    QInfiniteScroll,
    QSelect,
    QInput,
    HistoryEntry,
    KSpinner,
  },
  mixins: [
    statusMixin,
    paginationMixin,
    bindRoute({
      historyType: 'all',
      userId: 'all',
      before: '2019-11-19T00:00',
    }),
  ],
  props: {
    history: { required: true, type: Array },
    status: { default: null, type: Object },
  },
  computed: {
    empty () {
      return !this.history.length && !this.status.pending && !this.status.hasValidationErrors
    },
    historyTypeOptions () {
      return [
        {
          label: `all types (${this.history.length})`,
          value: 'all',
        },
        ...(Object.entries(this.history.reduce((acc, cur) => {
          acc[cur.typus] = 1 + (acc[cur.typus] || 0)
          return acc
        }, {})).map(([typus, count]) => ({
          label: `${this.historyTypeMessage(typus)} (${count})`,
          value: typus,
        }))),
      ]
    },
    usersOptions () {
      return [
        {
          label: `all users (${this.history.length})`,
          value: 'all',
        },
        ...(Object.entries(this.history.reduce((acc, cur) => {
          cur.users.forEach(u => {
            if (!acc[u.id]) acc[u.id] = { user: u, count: 0 }
            acc[u.id].count = 1 + acc[u.id].count
          })
          return acc
        }, {})).map(([_, { user, count }]) => ({
          label: `${user.displayName} (${count})`,
          value: user.id,
        }))),
      ]
    },
    filteredHistory () {
      if (!this.history) return []
      let filtered = this.history
      if (this.historyType !== 'all') filtered = filtered.filter(e => this.historyType === e.typus)
      if (this.userId !== 'all') filtered = filtered.filter(e => e.users.map(u => u.id).includes(parseInt(this.userId)))
      const beforeDate = date.extractDate(this.before, 'YYYY-MM-DDTHH:mm')
      filtered = filtered.filter(e => e.date < beforeDate)
      return filtered
    },
  },
  watch: {
    '$route.query' (val) {
      console.log('refetch', this.$route.params, this.$route.query)
      this.$store.dispatch('history/fetch', { ...this.$route.params, ...this.$route.query })
    },
  },
  methods: {
    historyTypeMessage (typus) {
      return this.$t('HISTORY.' + typus.toUpperCase(), { storeName: '...', name: '...', applicantName: '...' })
    },
  },
}
</script>
