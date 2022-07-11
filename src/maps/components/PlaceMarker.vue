<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


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
      default: () => null,
    },
  },
}
</script>
