<template>
  <EditPlaceTypesUI :place-types="placeTypes" />
</template>

<script setup>
import { computed } from 'vue'

import { useCurrentGroupService } from '@/group/services'
import { usePlaceTypeHelpers } from '@/places/helpers'
import { usePlaceTypeService } from '@/places/services'

import EditPlaceTypesUI from '@/group/components/EditPlaceTypesUI'

const { groupId } = useCurrentGroupService()
const { getPlaceTypesByGroup } = usePlaceTypeService()
const { getTranslatedName } = usePlaceTypeHelpers()

function sortByTranslatedName (a, b) {
  return getTranslatedName(a).localeCompare(getTranslatedName(b))
}

const placeTypes = computed(() => getPlaceTypesByGroup(groupId.value)
  .sort(sortByTranslatedName))
</script>
