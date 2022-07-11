<<<<<<< HEAD
<!-- 
SPDX-FileCopyrightText: 2016 Nick Sellen <hello@nicksellen.co.uk> 
SPDX-FileCopyrightText: 2016 Karrot

SPDX-License-Identifier: MIT

Karrot
-->

=======
<template>
  <PlaceEdit
    :value="$store.getters['places/activePlace']"
    :all-places="$store.getters['places/byCurrentGroup']"
    :status="status"
    @save="data => $store.dispatch('places/save', data)"
  />
</template>
>>>>>>> 1e9d7f5c902ea21eeabe5c51701cb81047cd4681

<script>
import PlaceEdit from '@/places/components/PlaceEdit'

export default {
  components: {
    PlaceEdit,
  },
  computed: {
    status () {
      const active = this.$store.getters['places/activePlace']
      return active && active.saveStatus
    },
  },
}
</script>
