<template>
  <PlaceEdit
    :value="$store.getters['places/activePlace']"
    :all-places="$store.getters['places/byCurrentGroup']"
    :status="status"
    @save="data => $store.dispatch('places/save', data)"
  />
</template>

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
