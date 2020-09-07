<template>
  <div>
    <QTable
      title="Activity statistics"
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
          label="User"
          filled
          :options="userOptions"
          :display-value="userFilter ? usersById[userFilter].displayName : 'All users'"
          emit-value
          class="q-mr-sm"
        />
        <QSelect
          v-model="periodFilter"
          label="Time period"
          filled
          :options="periodFilterOptions"
        />
      </template>
    </QTable>
  </div>
</template>

<script>
import { QSelect, QTable } from 'quasar'
import subDays from 'date-fns/subDays'
import subMonths from 'date-fns/subMonths'

import api from '@/statistics/api/statistics'
import { mapGetters } from 'vuex'
import { indexById } from '@/utils/datastore/helpers'
export default {
  components: {
    QSelect,
    QTable,
  },
  data () {
    const periodFilterOptions = [
      // If you add new options, be sure to handle them in dateQuery too
      {
        label: 'Previous 7 days!',
        value: '7days',
      },
      {
        label: 'Previous 30 days',
        value: '30days',
      },
      {
        label: 'Previous 3 months',
        value: '3months',
      },
      {
        label: 'Previous 6 months',
        value: '6months',
      },
    ]
    return {
      loading: true,
      periodFilter: periodFilterOptions[1],
      periodFilterOptions,
      userFilter: null,
      data: [],
      columns: [
        {
          name: 'place',
          label: 'Place',
          field: row => row.place && row.place.name,
          align: 'left',
        },
        ...[
          ['doneCount', 'Done'],
          ['leaveCount', 'Left'],
          ['leaveLateCount', 'Left late'],
        ].map(([field, label]) => ({
          name: field,
          label,
          field: row => row[field],
          align: 'right',
        })),
        {
          name: 'feedbackWeight',
          label: 'Weight',
          field: row => row.feedbackWeight.toFixed(1),
          format: value => `${value} kg`,
          align: 'right',
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
    usersById () {
      return indexById(this.users)
    },
    usersAsOptions () {
      return this.users.map(user => ({
        label: user.displayName,
        value: user.id,
      }))
    },
    userOptions () {
      return [
        {
          label: 'All users',
          value: null,
        },
        ...this.usersAsOptions,
      ]
    },
    totals () {
      return [
        'doneCount',
        'leaveCount',
        'leaveLateCount',
        'feedbackWeight',
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
          name: 'Total',
          ...this.totals,
        },
      ]
    },
    query () {
      return {
        group: this.currentGroupId,
        user: this.userFilter,
        ...this.dateQuery,
      }
    },
    dateQuery () {
      if (!this.periodFilter.value) return {}
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
        default:
          throw new Error(`unknown date filter option: ${this.periodFilter.value}`)
      }
    },
  },
  watch: {
    query: {
      immediate: true,
      async handler (params) {
        if (Object.keys(params).length === 0) return
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
}
</script>

<style scoped lang="stylus">
// the last row is our special totals row, so make it stand out
>>> tr:last-child td
  font-weight 500
</style>
