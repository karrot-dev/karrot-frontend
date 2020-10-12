<template>
  <div>
    <div
      v-if="filter && activities.length > 0"
      class="row no-wrap items-center justify-between bg-white q-px-sm q-py-xs q-gutter-sm"
    >
      <span v-t="'ACTIVITYLIST.TYPE'" />
      <QSelect
        v-model="type"
        :options="typeOptions"
        emit-value
        map-options
        outlined
        hide-bottom-space
        dense
      />

      <span v-t="'ACTIVITYLIST.SLOTS'" />
      <QSelect
        v-model="slots"
        :options="slotsOptions"
        emit-value
        map-options
        outlined
        hide-bottom-space
        dense
      />
      <div class="text-caption q-ml-xs col text-right">
        {{ filteredActivities.length }} / {{ activities.length }}
      </div>
    </div>
    <KSpinner v-show="pending" />
    <QInfiniteScroll
      v-if="!pending"
      :disable="numDisplayed > filteredActivities.length"
      :offset="100"
      @load="displayMoreActivities"
    >
      <ActivityItem
        v-for="activity in displayedActivities"
        :key="activity.id"
        v-measure
        :activity="activity"
        :place-link="placeLink"
        @join="$emit('join', arguments[0])"
        @leave="$emit('leave', arguments[0])"
        @detail="$emit('detail', arguments[0])"
      />
      <template #loading>
        <KSpinner />
      </template>
    </QInfiniteScroll>
  </div>
</template>

<script>
import ActivityItem from './ActivityItem'
import KSpinner from '@/utils/components/KSpinner'
import bindRoute from '@/utils/mixins/bindRoute'

import {
  QSelect,
  QInfiniteScroll,
} from 'quasar'

const NUM_ACTIVITIES_PER_LOAD = 25

export default {
  components: {
    QInfiniteScroll,
    ActivityItem,
    KSpinner,
    QSelect,
  },
  mixins: [
    bindRoute({
      slots: 'all',
      type: 'all',
    }),
  ],
  props: {
    activities: {
      type: Array,
      required: true,
    },
    placeLink: {
      type: Boolean,
      default: false,
    },
    pending: {
      type: Boolean,
      default: false,
    },
    filter: {
      type: Boolean,
      default: false,
    },
    filterActivityTypes: {
      type: Array,
      default: () => [],
    },
  },
  data () {
    return {
      numDisplayed: NUM_ACTIVITIES_PER_LOAD,
      types: [],
    }
  },
  computed: {
    slotsOptions () {
      return [
        {
          label: this.$t('ACTIVITYLIST.FILTER.ALL'),
          value: 'all',
        },
        {
          label: this.$t('ACTIVITYLIST.FILTER.FREE'),
          value: 'free',
        },
        {
          label: this.$t('ACTIVITYLIST.FILTER.EMPTY'),
          value: 'empty',
        },
      ]
    },
    typeOptions () {
      return [
        {
          label: this.$t('ACTIVITYLIST.FILTER.ALL'),
          value: 'all',
        },
        ...this.filterActivityTypes.map(activityType => {
          return {
            label: activityType.name,
            value: String(activityType.id),
          }
        }),
      ]
    },
    filteredActivities () {
      if (!this.activities) return []
      return this.activities
        .filter(this.slotFilter)
        .filter(this.typeFilter)
    },
    displayedActivities () {
      return this.filteredActivities.slice(0, this.numDisplayed)
    },
  },
  watch: {
    slots (val, old) {
      // keep selection valid, revert to old value or default
      const options = this.slotsOptions.map(o => o.value)
      if (!options.includes(val)) {
        if (options.includes(old)) {
          this.slots = old
        }
        else {
          this.slots = options[0]
        }
      }
    },
  },
  methods: {
    async displayMoreActivities (index, done) {
      this.numDisplayed += NUM_ACTIVITIES_PER_LOAD
      await this.$nextTick()
      done()
    },
    slotFilter (activity) {
      if (this.slots === 'free') return !activity.isFull
      if (this.slots === 'empty') return activity.isEmpty
      return true
    },
    typeFilter (activity) {
      if (this.type === 'all') return true
      return activity.typus && String(activity.typus.id) === this.type
    },
  },
}
</script>
