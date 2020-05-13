<template>
  <div>
    <div
      v-if="filter && pickups.length > 0"
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
        {{ filteredPickups.length }} / {{ pickups.length }}
      </div>
    </div>
    <KSpinner v-show="pending" />
    <QInfiniteScroll
      v-if="!pending"
      :disable="numDisplayed > filteredPickups.length"
      :offset="100"
      @load="displayMorePickups"
    >
      <PickupItem
        v-for="pickup in displayedPickups"
        :key="pickup.id"
        v-measure
        :pickup="pickup"
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
import PickupItem from './PickupItem'
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
    PickupItem,
    KSpinner,
    QSelect,
  },
  mixins: [
    bindRoute({
      slots: 'all',
    }),
  ],
  props: {
    pickups: {
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
    filteredPickups () {
      if (!this.pickups) return []
      if (this.slots === 'free') return this.pickups.filter(e => !e.isFull)
      if (this.slots === 'empty') return this.pickups.filter(e => e.isEmpty)
      return this.pickups
    },
    displayedPickups () {
      return this.filteredPickups.slice(0, this.numDisplayed)
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
    async displayMorePickups (index, done) {
      this.numDisplayed += NUM_PICKUPS_PER_LOAD
      await this.$nextTick()
      done()
    },
  },
}
</script>
