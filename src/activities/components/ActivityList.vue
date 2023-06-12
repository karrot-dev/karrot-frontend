<template>
  <div>
    <template
      v-for="(day, index) in displayedActivitiesGroupedByDate"
    >
      <div
        v-if="!dense"
        :key="`day-${index}`"
        class="q-px-sm q-pt-lg full-width text-center text-bold"
        style="color: rgba(0, 0, 0, 0.7);"
      >
        {{ day.date }}
      </div>
      <ActivityItem
        v-for="activity in day.activities"
        :key="activity.id"
        v-measure
        :dense="dense"
        :activity="activity"
        :place-link="placeLink"
      />
    </template>
  </div>
</template>

<script>
import ActivityItem from './ActivityItem.vue'

export default {
  components: {
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
  },
  computed: {
    displayedActivitiesGroupedByDate () {
      const result = []
      let dateIterated = ''
      for (const activity of this.activities) {
        const dateWithDayName = this.$d(activity.date, 'dateWithDayName')
        if (dateWithDayName !== dateIterated) {
          result.push({ date: dateWithDayName, activities: [] })
        }
        result[result.length - 1].activities.push(activity)
        dateIterated = dateWithDayName
      }
      return result
    },
  },
}
</script>
