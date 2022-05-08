<template>
  <EditActivityTypesUI
    :activity-types="$store.getters['activityTypes/byCurrentGroup']"
    :activity-type-create-status="$store.getters['activityTypes/createStatus']"
    @create="data => $store.dispatch('activityTypes/create', data)"
    @save="data => $store.dispatch('activityTypes/save', data)"
  />
</template>

<script>
import EditActivityTypesUI from '@/group/components/EditActivityTypesUI'

export default {
  components: {
    EditActivityTypesUI,
  },
}
</script>
