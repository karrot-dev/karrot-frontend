<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->


<<<<<<< HEAD



=======
<template>
  <GroupEdit
    :timezones="$store.getters['timezones/autocompleteData']"
    :all-groups="$store.getters['groups/all']"
    :status="$store.getters['groups/createStatus']"
    :default-map-center="$store.getters['geo/myCoordinates']"
    @save="data => $store.dispatch('groups/create', data)"
    @reset="$store.dispatch('groups/meta/clear', ['create'])"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import GroupEdit from '@/group/components/GroupEdit'

export default {
  components: {
    GroupEdit,
  },
}
</script>
