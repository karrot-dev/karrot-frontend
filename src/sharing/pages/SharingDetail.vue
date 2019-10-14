<template>
  <div v-if="item">
    <div class="photo">
      <img
        :src="item.photoUrls.fullSize"
        class="full-width"
      >
    </div>
    <h2>{{ item.name }}</h2>
    <p>{{ item.description }}</p>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'

export default {
  components: {},
  computed: {
    ...mapGetters({
      item: 'sharingItems/current',
    }),
  },
}
</script>

<style scoped lang="stylus">
  .photo
    width 100%
</style>
