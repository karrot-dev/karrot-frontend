<template>
  <PlaceEdit
    :value="place"
    :all-places="places"
    :status="status"
    @save="place => save(place)"
  />
</template>

<script setup>
import { computed } from 'vue'

import PlaceEdit from '@/places/components/PlaceEdit'
import { useSavePlaceMutation } from '@/places/mutations'
import { useCurrentGroupService } from '@/group/services'
import { useActivePlaceService, usePlaceService } from '@/places/services'

const { groupId } = useCurrentGroupService()
const { getPlacesByGroup } = usePlaceService()
const { place } = useActivePlaceService()

const places = computed(() => getPlacesByGroup(groupId.value))

const {
  mutate: save,
  status,
} = useSavePlaceMutation()
</script>
