<template>
  <PlaceEdit
    :all-places="places"
    :current-group="group"
    :status="status"
    @save="place => create(place)"
    @cancel="$router.go(-1)"
  />
</template>

<script setup>
import { computed } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { useCreatePlaceMutation } from '@/places/mutations'
import { usePlaceService } from '@/places/services'

import PlaceEdit from '@/places/components/PlaceEdit'

const { groupId, group } = useCurrentGroupService()
const { getPlacesByGroup } = usePlaceService()

const places = computed(() => getPlacesByGroup(groupId.value))

const {
  mutate: create,
  status,
} = useCreatePlaceMutation({ groupId })
</script>
