<template>
  <div>
    <QTable
      v-measure
      :title="$t('STATISTICS.ACTIVITY_HISTORY')"
      flat
      square
      :loading="loading"
      :columns="columns"
      :rows="enrichedData"
      column-sort-order="da"
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
          style="min-width: 180px;"
        >
          <template #option="{ index, itemProps, opt: { label: itemLabel, sectionLabel } }">
            <template v-if="sectionLabel">
              <QSeparator />
              <QItemLabel header>
                {{ sectionLabel }}
              </QItemLabel>
            </template>
            <QItem
              :key="index"
              v-bind="itemProps"
            >
              <QItemSection>
                <QItemLabel>
                  {{ itemLabel }}
                </QItemLabel>
              </QItemSection>
            </QItem>
          </template>
        </QSelect>
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
          <template #option="{ itemProps, opt, selected, toggleOption }">
            <QItem
              v-bind="itemProps"
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
                  :model-value="selected"
                  @update:model-value="toggleOption(opt)"
                />
              </QItemSection>
            </QItem>
          </template>
        </QSelect>
      </template>
      <template #body-cell-type="props">
        <QTd :props="props">
          <QIcon
            v-bind="getPlaceIconProps(props.value)"
            size="1.1em"
          />
        </QTd>
      </template>
      <template #body-cell-place="props">
        <QTd :props="props">
          <RouterLink
            :to="{ name: 'place', params: { groupId: props.value.group, placeId: props.value.id }}"
            class="block ellipsis"
            :title="props.value.name"
          >
            {{ props.value.name }}
          </RouterLink>
        </QTd>
      </template>
      <template #bottom-row>
        <QTr v-if="!loading">
          <QTd
            v-for="col in columns"
            :key="col.name"
            class="text-right text-bold"
            :class="totals[col.name] === 0 ? 'text-grey-5' : ''"
          >
            <template v-if="col.name === 'feedbackWeight'">
              {{ totals[col.name].toFixed(1) }} kg
            </template>
            <template v-else>
              {{ totals[col.name] }}
            </template>
          </QTd>
        </QTr>
      </template>
    </QTable>
  </div>
</template>

<script>
import { endOfYear, getYear, startOfYear, subYears } from 'date-fns'
import subDays from 'date-fns/subDays'
import subMonths from 'date-fns/subMonths'
import { QSelect, QTable, QToggle, QItem, QItemSection, QItemLabel, QSeparator, QTr, QTd, QIcon } from 'quasar'

import { useCurrentGroupService } from '@/group/services'
import { usePlaceHelpers } from '@/places/helpers'
import { usePlaceService } from '@/places/services'
import api from '@/statistics/api/statistics'
import { indexById } from '@/utils/datastore/helpers'

export default {
  components: {
    QIcon,
    QTd,
    QTr,
    QSelect,
    QTable,
    QToggle,
    QItem,
    QItemSection,
    QItemLabel,
    QSeparator,
  },
  setup () {
    const {
      groupId: currentGroupId,
      users,
    } = useCurrentGroupService()
    const {
      getPlaceById,
    } = usePlaceService()
    const {
      getPlaceIconProps,
    } = usePlaceHelpers()
    return {
      currentGroupId,
      users,
      getPlaceById,
      getPlaceIconProps,
    }
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
    hasUserFilter () {
      return this.userFilter && this.userFilter.value !== null
    },
    columns () {
      function fadedZeroValueClasses (key) {
        return row => {
          return row[key] === 0 ? 'text-grey-5' : ''
        }
      }
      function nonLocaleCompare (a, b) {
        return a < b ? -1 : (a > b ? 1 : 0)
      }
      return [
        {
          name: 'type',
          label: this.$t('STATISTICS.COLUMN_PLACE_TYPE'),
          // Pass the whole place in, as we use a custom cell template
          field: row => row.place,
          classes: 'column-type',
          headerClasses: 'column-type',
          align: 'right',
          sortable: true,
          sort: (a, b, rowA, rowB) => rowA.place?.placeType - rowB.place?.placeType,
        },
        {
          name: 'place',
          label: this.$t('STATISTICS.COLUMN_PLACE'),
          // Pass the whole place in, as we use a custom cell template
          field: row => row.place,
          classes: 'column-place',
          headerClasses: 'column-place',
          // style: { maxWidth: '100px' },
          align: 'left',
          sortable: true,
          sort: (a, b, rowA, rowB) => nonLocaleCompare(rowA.place?.name, rowB.place?.name),
        },
        {
          name: 'doneCount',
          label: this.$t('STATISTICS.COLUMN_ACTIVITY_DONE'),
          field: row => row.doneCount,
          classes: fadedZeroValueClasses('doneCount'),
          align: 'right',
          sortable: true,
        },
        {
          name: 'feedbackCount',
          label: this.$t('STATISTICS.COLUMN_FEEDBACK'),
          field: row => row.feedbackCount,
          classes: fadedZeroValueClasses('feedbackCount'),
          align: 'right',
          sortable: true,
        },
        {
          name: 'noShowCount',
          label: this.$t('STATISTICS.COLUMN_ACTIVITY_NO_SHOW'),
          field: row => row.noShowCount,
          classes: fadedZeroValueClasses('noShowCount'),
          align: 'right',
          sortable: true,
        },
        !this.hasUserFilter && {
          name: 'missedCount',
          label: this.$t('STATISTICS.COLUMN_ACTIVITY_MISSED'),
          field: row => row.missedCount,
          classes: fadedZeroValueClasses('missedCount'),
          align: 'right',
          sortable: true,
        },
        {
          name: 'leaveCount',
          label: this.$t('STATISTICS.COLUMN_ACTIVITY_LEFT'),
          field: row => row[this.leaveCountKey],
          classes: fadedZeroValueClasses(this.leaveCountKey),
          align: 'right',
          sortable: true,
        },
        {
          name: 'feedbackWeight',
          label: this.$t('STATISTICS.COLUMN_FEEDBACK_WEIGHT'),
          field: row => row.feedbackWeight.toFixed(1),
          classes: fadedZeroValueClasses('feedbackWeight'),
          format: value => value > 0 ? `${value} kg` : '-',
          align: 'right',
          sortable: true,
          sort: (a, b, rowA, rowB) => rowA.feedbackWeight - rowB.feedbackWeight,
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
      const now = new Date()
      return [
        {
          label: this.$t('STATISTICS.FILTER_TIME_PREVIOUS_DAYS', { count: 7 }),
          value: '7days',
          dateQuery () {
            return {
              dateAfter: subDays(new Date(), 7),
            }
          },
        },
        {
          label: this.$t('STATISTICS.FILTER_TIME_PREVIOUS_DAYS', { count: 30 }),
          value: '30days',
          dateQuery () {
            return {
              dateAfter: subDays(new Date(), 30),
            }
          },
        },
        {
          label: this.$t('STATISTICS.FILTER_TIME_PREVIOUS_MONTHS', { count: 3 }),
          value: '3months',
          dateQuery () {
            return {
              dateAfter: subMonths(new Date(), 3),
            }
          },
        },
        {
          label: this.$t('STATISTICS.FILTER_TIME_PREVIOUS_MONTHS', { count: 6 }),
          value: '6months',
          dateQuery () {
            return {
              dateAfter: subMonths(new Date(), 6),
            }
          },
        },
        {
          label: this.$t('STATISTICS.FILTER_TIME_PREVIOUS_MONTHS', { count: 12 }),
          value: '12months',
          onlyAggregate: true,
          dateQuery () {
            return {
              dateAfter: subMonths(new Date(), 12),
            }
          },
        },
        {
          label: this.$t('STATISTICS.FILTER_TIME_FOREVER'),
          value: null,
          onlyAggregate: true,
          dateQuery () {
            return {}
          },
        },
        {
          label: getYear(now),
          value: 'thisyear',
          onlyAggregate: true,
          sectionLabel: this.$t('STATISTICS.FILTER_TIME_YEARS_LABEL'),
          dateQuery () {
            const date = new Date()
            return {
              dateAfter: startOfYear(date),
              dateBefore: endOfYear(date),
            }
          },
        },
        {
          label: getYear(now) - 1,
          value: 'lastyear',
          onlyAggregate: true,
          dateQuery () {
            const date = subYears(new Date(), 1)
            return {
              dateAfter: startOfYear(date),
              dateBefore: endOfYear(date),
            }
          },
        },
        {
          label: getYear(now) - 2,
          value: 'twoyearsago',
          onlyAggregate: true,
          dateQuery () {
            const date = subYears(new Date(), 2)
            return {
              dateAfter: startOfYear(date),
              dateBefore: endOfYear(date),
            }
          },
        },
      ].map(option => {
        return {
          ...option,
          disable: option.onlyAggregate ? this.hasUserFilter : false,
        }
      })
    },
    totals () {
      return [
        'doneCount',
        'feedbackCount',
        'noShowCount',
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
          place: this.getPlaceById(entry.place) || {},
        }
      })
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
      return this.periodFilter.dateQuery()
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
    leaveCountKey () {
      const missed = this.leftOptionsValues.includes('missed')
      const late = this.leftOptionsValues.includes('late')
      if (late) {
        return missed ? 'leaveMissedLateCount' : 'leaveLateCount'
      }
      else {
        return missed ? 'leaveMissedCount' : 'leaveCount'
      }
    },
  },
  watch: {
    'userFilter.value' (value) {
      if (value !== null && this.periodFilter.onlyAggregate) {
        // Cannot have a user selected with an "onlyAggregate" filter, select the highest possible one
        this.periodFilter = this.periodFilterOptions.filter(option => !option.onlyAggregate).reverse()[0]
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
  },
}
</script>
<style lang="sass" scoped>
// Ensure when you hover on a currently-unsorted header, the arrow will point
// the way it will sort when you click it
// See https://github.com/quasarframework/quasar/issues/8527#issuecomment-826952890
::v-deep(th.sortable:not(.sorted) .q-table__sort-icon)
  transform: rotate(180deg)

::v-deep(.q-table th),
::v-deep(.q-table td)
  padding-left: 8px
  padding-right: 8px
  width: 24px

::v-deep(.column-type)
  padding-left: 0 !important

::v-deep(.column-place)
  width: auto
  max-width: 180px
</style>
