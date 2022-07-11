<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->



<<<<<<< HEAD

=======
<template>
  <PlaceEdit
    :all-places="$store.getters['places/byCurrentGroup']"
    :current-group="$store.getters['currentGroup/value']"
    :status="$store.getters['places/createStatus']"
    @save="data => $store.dispatch('places/create', data)"
    @cancel="$router.go(-1)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import PlaceEdit from '@/places/components/PlaceEdit'

export default {
  components: {
    PlaceEdit,
  },
}
</script>
