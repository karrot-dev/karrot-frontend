<template>
  <div v-if="place">
    <RouterLink
      class="float-right"
      :to="{ name: 'placeEdit', params: { groupId: place.group.id, placeId: place.id } }"
    >
      <i
        class="fas fa-pencil-alt"
      />
    </RouterLink>
    <Markdown :source="place.publicDescription" />
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import Markdown from '@/utils/components/Markdown'

export default {
  components: {
    Markdown,
  },
  computed: {
    ...mapGetters({
      place: 'placesInfo/activePlace',
    }),
  },
}
</script>

<style scoped lang="stylus">
</style>
