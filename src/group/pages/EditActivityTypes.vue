<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<<<<<<< HEAD


=======
<template>
  <EditActivityTypesUI
    :activity-types="$store.getters['activityTypes/byCurrentGroup']"
    :activity-type-create-status="$store.getters['activityTypes/createStatus']"
    @create="data => $store.dispatch('activityTypes/create', data)"
    @save="data => $store.dispatch('activityTypes/save', data)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import EditActivityTypesUI from '@/group/components/EditActivityTypesUI'

export default {
  components: {
    EditActivityTypesUI,
  },
}
</script>
