<template>
  <PlaceEdit
    :all-places="$store.getters['places/byCurrentGroup']"
    :current-group="$store.getters['currentGroup/value']"
    :status="$store.getters['places/createStatus']"
    @save="data => $store.dispatch('places/create', data)"
    @cancel="$router.go(-1)"
  />
</template>

<script>
import PlaceEdit from '@/places/components/PlaceEdit'

export default {
  components: {
    PlaceEdit,
  },
}
</script>
