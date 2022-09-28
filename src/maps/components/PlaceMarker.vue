<template>
  <div v-if="place && place.id && place.group">
    <RouterLink :to="{ name: 'place', params: { groupId: place.group, placeId: place.id } }">
      {{ place.name }}
    </RouterLink>
  </div>
</template>

<script>
export default {
  props: {
    place: {
      type: Object,
      default: () => null,
    },
  },
}
</script>
