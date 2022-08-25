<template>
  <div
    class="userMapPreview"
    style="position: relative"
  >
    <StandardMap
      :markers="markers"
      :show-attribution="false"
    />
    <RouterLink
      class="overlay"
      :to="{ name: 'map', params: { groupId, userId: user.id } }"
    />
  </div>
</template>

<script setup>
import { computed } from 'vue'

import { useCurrentGroupService } from '@/group/services'

import StandardMap from '@/maps/components/StandardMap'
import { userMarker } from '@/maps/components/markers'

const props = defineProps({
  user: {
    type: Object,
    required: true,
  },
})

const { groupId } = useCurrentGroupService()

const markers = computed(() => [userMarker(props.user)])
</script>

<style scoped lang="sass">
.overlay
  position: absolute
  top: 0
  left: 0
  width: 100%
  height: 100%
</style>

<style lang="sass">
.userMapPreview .leaflet-top.leaflet-left
  display: none
</style>
