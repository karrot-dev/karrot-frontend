<template>
  <GroupedActivities
    :activities="activities"
    :dense="dense"
  >
    <template #default="{ entries }">
      <ActivityItem
        v-for="activity in entries"
        :key="activity.id"
        v-measure
        :dense="dense"
        :activity="activity"
        :place-link="placeLink"
      />
    </template>
  </GroupedActivities>
</template>

<script setup>
import GroupedActivities from '@/activities/components/GroupedActivities.vue'

import ActivityItem from './ActivityItem.vue'

defineProps({
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
})
</script>
