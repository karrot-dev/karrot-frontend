<template>
  <div>
    <template
      v-for="({ date, formattedDate, activities }, index) in displayedActivitiesGroupedByDate"
    >
      <div
        v-if="!dense"
        :key="`day-${index}`"
        class="q-px-sm q-pt-lg full-width text-center text-bold"
        style="color: rgba(0, 0, 0, 0.7);"
      >
        {{ formattedDate }}
        <span class="text-weight-light">
          &mdash;
        </span>
        <DateAsWords
          :date="date"
          class="inline-block text-weight-light"
        />
      </div>
      <ActivityItem
        v-for="activity in activities"
        :key="activity.id"
        v-measure
        :dense="dense"
        :activity="activity"
        :place-link="placeLink"
        :read-only="readOnly"
      />
    </template>
  </div>
</template>

<script>
import DateAsWords from '@/utils/components/DateAsWords.vue'

import ActivityItem from './ActivityItem.vue'

export default {
  components: {
    DateAsWords,
    ActivityItem,
  },
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
    dense: {
      type: Boolean,
      default: false,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    displayedActivitiesGroupedByDate () {
      const result = []
      let currentFormattedDate = ''
      for (const activity of this.activities) {
        const date = activity.date
        const formattedDate = this.$d(date, 'dateWithDayName')
        if (formattedDate !== currentFormattedDate) {
          result.push({ date, formattedDate, activities: [] })
        }
        result[result.length - 1].activities.push(activity)
        currentFormattedDate = formattedDate
      }
      return result
    },
  },
}
</script>
