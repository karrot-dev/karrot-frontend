<template>
  <template
    v-for="({ date, formattedDate, entries }, index) in displayedActivitiesGroupedByDate"
    :key="`day-${index}`"
  >
    <div
      v-if="!dense"
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
    <slot :entries="entries" />
  </template>
</template>

<script setup>
import { computed, toRefs } from 'vue'
import { useI18n } from 'vue-i18n'

import DateAsWords from '@/utils/components/DateAsWords.vue'

const props = defineProps({
  activities: {
    type: Array,
    required: true,
  },
  dense: {
    type: Boolean,
    default: false,
  },
})

const { activities } = toRefs(props)

const { d } = useI18n()

const displayedActivitiesGroupedByDate = computed(() => {
  const result = []
  let currentFormattedDate = ''
  for (const activity of activities.value) {
    const date = activity.date
    const formattedDate = d(date, 'dateWithDayName')
    if (formattedDate !== currentFormattedDate) {
      result.push({ date, formattedDate, entries: [] })
    }
    result[result.length - 1].entries.push(activity)
    currentFormattedDate = formattedDate
  }
  return result
})

</script>
