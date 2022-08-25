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

import { useCurrentGroupService } from '@/group/services'
import { useSavePlaceMutation } from '@/places/mutations'
import { useActivePlaceService, usePlaceService } from '@/places/services'

import PlaceEdit from '@/places/components/PlaceEdit'

const { groupId } = useCurrentGroupService()
const { getPlacesByGroup } = usePlaceService()
const { place } = useActivePlaceService()

const places = computed(() => getPlacesByGroup(groupId.value))

const {
  mutate: save,
  status,
} = useSavePlaceMutation()
</script>
