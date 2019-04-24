<template>
  <div v-if="place && place.group">
    <RouterLink :to="{ name: 'placeInfo', params: { groupId: place.group.id, placeInfoId: place.id } }">
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
