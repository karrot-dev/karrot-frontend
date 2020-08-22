<template>
  <div>
    <QTable
      title="Activity statistics"
      flat
      square
      :columns="columns"
      :data="dataWithTotals"
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
      {
        label: 'Nothing!',
        value: null,
      },
      {
        label: 'Something!',
        value: 'previous7days',
      },
      {
        label: 'Previous 30 days',
        value: 'previous30days',
      },
    ]
    return {
      // Maybe need a left late and pickup was not eventually done!!! left late AND missed...
      // periodFilter: 'previous7days',
      periodFilter: periodFilterOptions[0],
      periodFilterOptions,
      userFilter: null,
      data: [],
      columns: [
        {
          name: 'place',
          label: 'Place',
          field: row => row.name,
          align: 'left',
        },
        ...[
          ['activityDoneCount', 'Done'],
          ['activityLeaveCount', 'Left'],
          ['activityLeaveLateCount', 'Left late'],
        ].map(([field, label]) => ({
          name: field,
          label,
          field: row => row[field],
          align: 'right',
        })),
        {
          name: 'activityFeedbackWeight',
          label: 'Weight',
          field: row => row.activityFeedbackWeight.toFixed(1),
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
      const out = {}
      for (const field of [
        'activityDoneCount',
        'activityLeaveCount',
        'activityLeaveLateCount',
        'activityFeedbackWeight',
      ]) {
        out[field] = this.data.reduce((sum, entry) => sum + entry[field], 0)
      }
      return out
    },
    dataWithTotals () {
      if (this.data.length === 0) return []
      return [
        ...this.data,
        {
          name: 'Total',
          ...this.totals,
        },
      ]
    },
    query () {
      const params = {
        group: this.currentGroupId,
        user: this.userFilter,
      }
      if (this.periodFilter.value) {
        params.dateBefore = new Date()
      }
      return params
    },
  },
  watch: {
    query: {
      immediate: true,
      async handler (params) {
        if (Object.keys(params).length === 0) return
        console.log('fetching stats with params', params)
        this.data = await api.places(params)
      },
    },
    // userFilter: {
    //   immediate: true,
    //   async handler (id) {
    //     this.data = await api.places({ group: this.currentGroupId, user: id, dateBefore: new Date() })
    //   },
    // },
  },
}
</script>

<style scoped lang="stylus">
>>> tr:last-child td
  font-weight 500
</style>
