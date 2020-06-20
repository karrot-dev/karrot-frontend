<template>
  <div>
    <div
      v-if="filter && activities.length > 0"
      class="row no-wrap items-center justify-between bg-white q-px-sm q-py-xs"
    >
      <QSelect
        v-model="slots"
        :options="slotsOptions"
        emit-value
        map-options
        outlined
        hide-bottom-space
        dense
      />
      <div class="text-caption q-ml-xs">
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

const NUM_PICKUPS_PER_LOAD = 25

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
  },
  data () {
    return {
      numDisplayed: NUM_PICKUPS_PER_LOAD,
    }
  },
  computed: {
    slotsOptions () {
      return [
        {
          label: this.$t('PICKUPLIST.FILTER.ALL'),
          value: 'all',
        },
        {
          label: this.$t('PICKUPLIST.FILTER.FREE'),
          value: 'free',
        },
        {
          label: this.$t('PICKUPLIST.FILTER.EMPTY'),
          value: 'empty',
        },
      ]
    },
    filteredActivities () {
      if (!this.activities) return []
      if (this.slots === 'free') return this.activities.filter(e => !e.isFull)
      if (this.slots === 'empty') return this.activities.filter(e => e.isEmpty)
      return this.activities
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
      this.numDisplayed += NUM_PICKUPS_PER_LOAD
      await this.$nextTick()
      done()
    },
  },
}
</script>
