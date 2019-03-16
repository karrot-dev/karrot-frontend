<template>
  <div v-if="place && place.group">
    <RouterLink :to="{ name: 'place', params: { groupId: place.group.id, placeId: place.id } }">
      {{ place.name }}
    </RouterLink>
  </div>
</template>

<script>
export default {
  props: {
    place: {
      type: Object,
      required: true,
    },
  },
}
</script>
