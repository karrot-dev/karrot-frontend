<template>
  <div>
    <QTable
      :title="$t('STATISTICS.ACTIVITY_HISTORY')"
      flat
      square
      :loading="loading"
      :columns="columns"
      :data="enrichedDataWithTotals"
      row-key="id"
      hide-pagination
      :rows-per-page-options="[0]"
    >
      <template #top-right>
        <QSelect
          v-model="userFilter"
          :label="$t('STATISTICS.FILTER_USER_LABEL')"
          filled
          :options="userFilterOptions"
          use-input
          fill-input
          hide-selected
          class="q-mr-sm"
          @filter="filterUser"
        />
        <QSelect
          v-model="periodFilter"
          :label="$t('STATISTICS.FILTER_TIME_LABEL')"
          filled
          :options="periodFilterOptions"
          class="q-mr-sm"
        />
        <QSelect
          v-model="leftOptionsSelected"
          :label="$t('STATISTICS.COLUMN_ACTIVITY_LEFT')"
          filled
          :options="leftOptions"
          class="q-mr-sm"
          multiple
          style="min-width: 120px;"
          :display-value="leftOptionsDisplayValue"
        >
          <template #option="{ itemProps, itemEvents, opt, selected, toggleOption }">
            <QItem
              v-bind="itemProps"
              v-on="itemEvents"
            >
              <QItemSection>
                <QItemLabel>
                  {{ opt.label }}
                </QItemLabel>
                <QItemLabel caption>
                  {{ opt.description }}
                </QItemLabel>
              </QItemSection>
              <QItemSection side>
                <QToggle
                  :value="selected"
                  @input="toggleOption(opt)"
                />
              </QItemSection>
            </QItem>
          </template>
        </QSelect>
      </template>
    </QTable>
  </div>
</template>

<script>
import { QSelect, QTable, QToggle, QItem, QItemSection, QItemLabel } from 'quasar'
import subDays from 'date-fns/subDays'
import subMonths from 'date-fns/subMonths'

import api from '@/statistics/api/statistics'
import { mapGetters } from 'vuex'
import { indexById } from '@/utils/datastore/helpers'

export default {
  components: {
    QSelect,
    QTable,
    QToggle,
    QItem,
    QItemSection,
    QItemLabel,
  },
  data () {
    return {
      loading: true,
      periodFilter: null,
      userFilter: null,
      userFilterByName: null, // when the user types something in
      data: [],
      leftOptionsSelected: null,
      leftOptions: [
        {
          label: this.$t('STATISTICS.OPTIONS_MISSED_LABEL'),
          value: 'missed',
          description: this.$t('STATISTICS.OPTIONS_MISSED_DESCRIPTION'),
        },
        {
          label: this.$t('STATISTICS.OPTIONS_LATE_LABEL'),
          value: 'late',
          description: this.$t('STATISTICS.OPTIONS_LATE_DESCRIPTION'),
        },
      ],
    }
  },
  computed: {
    ...mapGetters({
      currentGroupId: 'currentGroup/id',
      users: 'users/byCurrentGroup',
      getPlace: 'places/get',
    }),
    hasUserFilter () {
      return this.userFilter && this.userFilter.value !== null
    },
    columns () {
      return [
        {
          name: 'place',
          label: this.$t('STATISTICS.COLUMN_PLACE'),
          field: row => row.place && row.place.name,
          align: 'left',
        },
        {
          name: 'doneCount',
          label: this.$t('STATISTICS.COLUMN_ACTIVITY_DONE'),
          field: row => row.doneCount,
          align: 'right',
        },
        {
          name: 'feedbackCount',
          label: this.$t('STATISTICS.COLUMN_FEEDBACK'),
          field: row => row.feedbackCount,
          align: 'right',
        },
        !this.hasUserFilter && {
          name: 'missedCount',
          label: this.$t('STATISTICS.COLUMN_ACTIVITY_MISSED'),
          field: row => row.missedCount,
          align: 'right',
        },
        {
          name: 'leaveCount',
          label: this.$t('STATISTICS.COLUMN_ACTIVITY_LEFT'),
          field: row => this.leaveCount(row),
          align: 'right',
        },
        {
          name: 'feedbackWeight',
          label: this.$t('STATISTICS.COLUMN_FEEDBACK_WEIGHT'),
          field: row => row.feedbackWeight.toFixed(1),
          format: value => `${value} kg`,
          align: 'right',
        },
      ].filter(Boolean)
    },
    usersById () {
      return indexById(this.users)
    },
    usersAsOptions () {
      return this.users.map(user => ({
        label: user.displayName,
        value: user.id,
      })).sort((a, b) => a.label.localeCompare(b.label))
    },
    userFilterOptions () {
      return [
        {
          label: this.$t('STATISTICS.FILTER_ALL_USERS'),
          value: null,
        },
        ...this.usersAsOptions,
      ].filter(option => {
        return !this.userFilterByName || option.label.toLowerCase().includes(this.userFilterByName)
      })
    },
    periodFilterOptions () {
      return [
        // If you add new options, be sure to handle them in dateQuery too
        {
          label: this.$t('STATISTICS.FILTER_TIME_PREVIOUS_DAYS', { count: 7 }),
          value: '7days',
        },
        {
          label: this.$t('STATISTICS.FILTER_TIME_PREVIOUS_DAYS', { count: 30 }),
          value: '30days',
        },
        {
          label: this.$t('STATISTICS.FILTER_TIME_PREVIOUS_MONTHS', { count: 3 }),
          value: '3months',
        },
        {
          label: this.$t('STATISTICS.FILTER_TIME_PREVIOUS_MONTHS', { count: 6 }),
          value: '6months',
        },
        {
          label: this.$t('STATISTICS.FILTER_TIME_PREVIOUS_MONTHS', { count: 12 }),
          value: '12months',
        },
        {
          label: this.$t('STATISTICS.FILTER_TIME_FOREVER'),
          value: null,
          disable: this.hasUserFilter,
        },
      ]
    },
    totals () {
      return [
        'doneCount',
        'feedbackCount',
        'missedCount',
        'leaveCount',
        'feedbackWeight',
        'leaveMissedLateCount',
        'leaveLateCount',
        'leaveMissedCount',
      ].reduce((acc, field) => {
        acc[field] = this.data.reduce((sum, entry) => sum + entry[field], 0)
        return acc
      }, {})
    },
    enrichedData () {
      return this.data.map(entry => {
        return {
          ...entry,
          place: this.getPlace(entry.place) || {},
        }
      })
    },
    enrichedDataWithTotals () {
      if (this.enrichedData.length === 0) return []
      return [
        ...this.enrichedData,
        {
          name: this.$t('STATISTICS.TOTAL_LABEL'),
          ...this.totals,
        },
      ]
    },
    query () {
      return {
        group: this.currentGroupId,
        user: this.userFilter && this.userFilter.value,
        ...this.dateQuery,
      }
    },
    dateQuery () {
      if (!this.periodFilter) return {}
      const now = new Date()
      switch (this.periodFilter.value) {
        case '7days':
          return {
            dateAfter: subDays(now, 7),
          }
        case '30days':
          return {
            dateAfter: subDays(now, 30),
          }
        case '3months':
          return {
            dateAfter: subMonths(now, 3),
          }
        case '6months':
          return {
            dateAfter: subMonths(now, 6),
          }
        case '12months':
          return {
            dateAfter: subMonths(now, 12),
          }
        case null:
          return {}
        default:
          throw new Error(`unknown date filter option: ${this.periodFilter.value}`)
      }
    },
    leftOptionsValues () {
      return this.leftOptionsSelected.map(option => option.value)
    },
    leftOptionsDisplayValue () {
      if (this.leftOptionsSelected.length > 0) {
        return this.leftOptionsSelected.map(option => option.label).join(', ')
      }
      else {
        return this.$t('STATISTICS.OPTIONS_ANY')
      }
    },
  },
  watch: {
    'userFilter.value' (value) {
      if (value !== null && this.periodFilter.value === null) {
        // It's required to have a period if have a user...
        this.periodFilter = this.periodFilterOptions.find(option => option.value === '6months')
      }
    },
    query: {
      immediate: true,
      async handler (params) {
        if (Object.keys(params).length === 0) return
        // don't run until options have been initialized
        if (!this.userFilter || !this.periodFilter) return
        // never permit user filters without date filter
        if (params.user && !params.dateAfter) return
        this.loading = true
        try {
          this.data = await api.activityHistory(params)
        }
        finally {
          this.loading = false
        }
      },
    },
  },
  created () {
    // Initial values
    this.periodFilter = this.periodFilterOptions[0]
    this.userFilter = this.userFilterOptions[0]
    this.leftOptionsSelected = this.leftOptions.filter(option => option.value === 'missed')
  },
  methods: {
    filterUser (val, update) {
      this.userFilterByName = val
      update()
    },
    leaveCount (row) {
      const missed = this.leftOptionsValues.includes('missed')
      const late = this.leftOptionsValues.includes('late')
      if (late) {
        return missed ? row.leaveMissedLateCount : row.leaveLateCount
      }
      else {
        return missed ? row.leaveMissedCount : row.leaveCount
      }
    },
  },
}
</script>

<style scoped lang="stylus">
// the last row is our special totals row, so make it stand out
>>> tr:last-child td
  font-weight 500
</style>
