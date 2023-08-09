<template>
  <GroupedActivities
    :activities="activities"
  >
    <template #default="{ entries }">
      <ActivityFeedbackItem
        v-for="activity in entries"
        :key="activity.id"
        v-measure
        :activity="activity"
      />
    </template>
  </GroupedActivities>
</template>

<script setup>
import ActivityFeedbackItem from '@/activities/components/ActivityFeedbackItem.vue'
import GroupedActivities from '@/activities/components/GroupedActivities.vue'

defineProps({
  activities: {
    type: Array,
    required: true,
  },
})
</script>
